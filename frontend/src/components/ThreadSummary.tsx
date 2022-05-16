import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import StatePieChart from "./StatePieChart";
import { Boundary } from "../page/main";
import { ReactComponent as Lock } from "../assets/lock.svg";
import { ReactComponent as Play } from "../assets/play.svg";
import { ReactComponent as Pause } from "../assets/pause.svg";
import { ReactComponent as Clock } from "../assets/clock.svg";
import { ReactComponent as ExpandMore } from "../assets/expand_more.svg";
import { ReactComponent as ExpandLess } from "../assets/expand_less.svg";
import axios from "axios";
import { HostSummary } from "../interfaces/HostInfo.interface";

const Shadow = styled.div`
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
`;

const Container = styled(Shadow)`
  display: flex;
  flex-direction: column;
  width: 80%;
  padding: 30px;
  border-radius: 10px;
`;
//   background-color: #60008010;

const Section = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  margin-bottom: 50px;
`;

const ToggleBox = styled.div<{ active?: boolean }>`
  overflow: hidden;
  transition: all 0.5s ease-in-out;
  height: ${(props) => (props.active ? "700px" : "0px")};

  border-radius: 10px;
  background-color: white;

  @media (max-width: 1536px) {
    height: ${(props) => (props.active ? "800px" : "0px")};
  }
`;

const Title = styled.h1`
  color: #333333;
  font-weight: 600;
  margin: 0px;
  text-align: left;
  cursor: pointer;
  display: flex;
`;

const SubTitle = styled.h2`
  color: #999999;
  font-weight: 400;
  margin: 0px;
  color: rgb(107, 114, 128);
`;

const CardContainer = styled.div<{ gridCol: number }>`
  margin: 20px 20px 0px 0px;
  display: grid;
  grid-template-columns: repeat(${(props) => props.gridCol}, minmax(0, 1fr));
  gap: 10px;
`;

const Card = styled(Shadow)`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  min-width: 200px;
  min-height: 200px;
  border: 2px solid #f7f7f7;
  border-radius: 10px;

  grid-column: span 1 / span 1;
  @media (max-width: 1536px) {
    grid-column: span 2 / span 4;
  }
`;

const ThreadState = styled.div<{ color?: string }>`
  margin: 0;
  padding: 5px;
  font-size: 1.2rem;
  font-weight: 400;
  white-space: nowrap;
  color: #333333;
  text-align: center;
  width: 80%;
  border-radius: 5px;
  background-color: ${(props) => props.color};
`;

const StateNum = styled.span`
  font-size: 3.5rem;
  font-weight: 400;
`;

export const handleStateColor = (state: string): string => {
  switch (state) {
    case "RUNNABLE":
      return "rgb(0, 215, 199, 0.5)";
    case "BLOCKED":
      return "rgb(228, 59, 94, 0.5)";
    case "WAITING":
      return "rgb(255, 124, 75, 0.5)";
    case "TIMED_WAITING":
      return "rgb(0, 151, 225, 0.5)";
  }
  return "";
};

interface ThreadSummaryProps {
  selectedIds: string[];
}

export default function ThreadSummary({ selectedIds }: ThreadSummaryProps) {
  const navigate = useNavigate();

  const [showDetail, setShowDetail] = useState<boolean[]>([]);
  const [hostSummaryArray, setSummaryArray] = useState<HostSummary[]>([]);
  useEffect(() => {
    const fetchAndSetSummaryArray = async () => {
      const BASE_URL: string = `https://k6s102.p.ssafy.io/api`;
      const requestURL: string =
        BASE_URL + `/host/state?_id=${selectedIds.join()}`;
      const res = await axios.get(requestURL);

      setSummaryArray(res.data.hosts);
      setShowDetail(new Array(res.data.hosts.length).fill(false));
    };

    fetchAndSetSummaryArray();
  }, [selectedIds]);

  const paintIcon = (state: string): JSX.Element => {
    switch (state) {
      case "RUNNABLE":
        return <Play width="40" height="40"></Play>;
      case "BLOCKED":
        return <Lock width="40" height="40"></Lock>;
      case "WAITING":
        return <Pause width="40" height="40"></Pause>;
      case "TIMED_WAITING":
        return <Clock width="40" height="40"></Clock>;
    }

    return <></>;
  };

  // 코드 중복 제거
  const threadStates = ["RUNNABLE", "BLOCKED", "WAITING", "TIMED_WAITING"];
  const paintCards = (hostSummary: HostSummary): JSX.Element[] => {
    return threadStates.map((state, idx) => (
      <Card
        key={idx}
        onClick={() => navigate(`/detail?state=${state}&id=${hostSummary._id}`)}
      >
        {paintIcon(state)}
        <StateNum>{hostSummary.threadStateCount[state]}</StateNum>
        <ThreadState color={handleStateColor(state)}>{state}</ThreadState>
      </Card>
    ));
  };

  const handleToggleClick = (idx: number): void => {
    // let offset: number = 200;
    setShowDetail((state): boolean[] => {
      const newState: boolean[] = [...state];
      newState[idx] = !state[idx];
      // if (newState[idx]) {
      //   offset = 800;
      // }

      return newState;
    });

    // setTimeout(() => {
    //   const element = document.getElementById(idx.toString())!;
    //   if (element) {
    //     console.log("YES");
    //     const elementPosition: number = element.getBoundingClientRect().top;
    //     const offsetPosition: number = elementPosition + offset;

    //     window.scrollTo({
    //       top: offsetPosition,
    //       behavior: "smooth",
    //     });
    //   }
    // }, 0);
  };

  const paintContainers: JSX.Element[] = hostSummaryArray?.map(
    (hostSummary, idx) => (
      <Container>
        <Title onClick={() => handleToggleClick(idx)}>
          host {hostSummary.host}{" "}
          <ExpandMore
            style={{
              transform: `rotate(${showDetail[idx] ? "-180" : "0"}deg)`,
              transition: "all 500ms ease",
            }}
          />
        </Title>
        <SubTitle>{hostSummary.logTime}</SubTitle>
        <ToggleBox id={idx.toString()} active={showDetail[idx]}>
          <SubTitle>Total Thread Count: {hostSummary.threadCount}</SubTitle>
          <Section>
            <CardContainer gridCol={4}>{paintCards(hostSummary)}</CardContainer>
            <StatePieChart threadStateCount={hostSummary.threadStateCount} />
          </Section>
          <Boundary />
          <Section>
            <CardContainer gridCol={6}>
              <Card>
                <StateNum>{hostSummary.daemonCount}</StateNum>
                <ThreadState color="rgba(95, 0, 128, 0.5)">Daemon</ThreadState>
              </Card>
              <Card>
                <StateNum>{hostSummary.nonDaemonCount}</StateNum>
                <ThreadState color="rgba(95, 0, 128, 0.2)">
                  non-Daemon
                </ThreadState>
              </Card>
            </CardContainer>
          </Section>
        </ToggleBox>
        {/* <Boundary />
        <SubTitle>Blocking Infos</SubTitle>
        <Container>
          <BlockingGraph></BlockingGraph>
        </Container> */}
      </Container>
    )
  );

  if (!hostSummaryArray.length) {
    return <>차트에서 특정 시점을 선택해주세요.</>;
  }

  return <>{paintContainers}</>;
}
