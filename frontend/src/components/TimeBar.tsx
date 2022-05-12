import * as React from "react";
import addWeeks from "date-fns/addWeeks";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import styled from "styled-components";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const Box = styled.div`
  background-color: #f7f7f7;
  width: 90%;
  margin: 30px;
`;

const Wave = styled.h2`
  padding: 0px 20px;
`;

const Content = styled.div`
  padding: 0px 20px;
  margin: 10px 0px;
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  margin: 20px 30px 20px 10px;
`;

const RadioLabelPoint = styled.label`
  border: 2px solid #5f0080;
  color: white;
  background-color: ${(props) =>
    props.color === "point" ? "#5f0080" : "white"};
  padding: 10px;
  border-radius: 3px;
  width: 15px;
  height: 15px;
`;
const RadioLabelRange = styled.label`
  border: 2px solid #5f0080;
  color: white;
  background-color: ${(props) =>
    props.color === "range" ? "#5f0080" : "white"};
  padding: 10px;
  border-radius: 3px;
  width: 15px;
  height: 15px;
`;
const RadioBtn = styled.input`
  display: none;
`;

interface propsType {
  pointAt: Date | null;
  startAt: Date | null;
  endAt: Date | null;
  category: string;
  setPointAt: React.Dispatch<React.SetStateAction<Date | null>>;
  setStartAt: React.Dispatch<React.SetStateAction<Date | null>>;
  setEndAt: React.Dispatch<React.SetStateAction<Date | null>>;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}

export default function TimeBar(props: propsType) {
  const handleClickRadioButton = (btn: string) => {
    props.setCategory(btn);
  };

  return (
    <Box>
      <Content>
        <RadioBtn
          type="radio"
          id="point"
          checked={props.category === "point"}
          onChange={() => handleClickRadioButton("point")}
        />
        <RadioLabelPoint htmlFor="point" color={`${props.category}`}>
          <span> ✔</span>
        </RadioLabelPoint>
        <Title>시점 조회</Title>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {props.category === "point" ? (
            <DateTimePicker
              inputFormat="yyyy/MM/dd hh:mm a"
              mask="___/__/__ __:__ _M"
              renderInput={(props) => <TextField {...props} />}
              value={props.pointAt}
              maxDateTime={new Date()}
              onChange={(newValue) => {
                props.setPointAt(newValue);
              }}
            />
          ) : (
            <DateTimePicker
              disabled
              inputFormat="yyyy/MM/dd hh:mm a"
              mask="___/__/__ __:__ _M"
              renderInput={(props) => <TextField {...props} />}
              value={props.pointAt}
              maxDateTime={new Date()}
              onChange={(newValue) => {
                props.setPointAt(newValue);
              }}
            />
          )}
        </LocalizationProvider>
      </Content>

      <Content>
        <RadioBtn
          type="radio"
          id="range"
          checked={props.category === "range"}
          onChange={() => handleClickRadioButton("range")}
        />
        <RadioLabelRange htmlFor="range" color={`${props.category}`}>
          <span> ✔</span>
        </RadioLabelRange>
        <Title>기간 조회</Title>
        {props.category === "range" ? (
          <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Start"
                inputFormat="yyyy/MM/dd hh:mm a"
                mask="___/__/__ __:__ _M"
                renderInput={(props) => <TextField {...props} />}
                value={props.startAt}
                maxDateTime={new Date()}
                onChange={(newValue) => {
                  props.setStartAt(newValue);
                }}
              />
            </LocalizationProvider>
            <Wave> ~ </Wave>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="End"
                inputFormat="yyyy/MM/dd hh:mm a"
                mask="___/__/__ __:__ _M"
                renderInput={(props) => <TextField {...props} />}
                value={props.endAt}
                minDateTime={props.startAt}
                maxDateTime={new Date()}
                onChange={(newValue) => {
                  props.setEndAt(newValue);
                }}
              />
            </LocalizationProvider>
          </>
        ) : (
          <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                disabled
                label="Start"
                inputFormat="yyyy/MM/dd hh:mm a"
                mask="___/__/__ __:__ _M"
                renderInput={(props) => <TextField {...props} />}
                value={props.startAt}
                maxDateTime={new Date()}
                onChange={(newValue) => {
                  props.setStartAt(newValue);
                }}
              />
            </LocalizationProvider>
            <Wave> ~ </Wave>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                disabled
                label="End"
                inputFormat="yyyy/MM/dd hh:mm a"
                mask="___/__/__ __:__ _M"
                renderInput={(props) => <TextField {...props} />}
                value={props.endAt}
                minDateTime={props.startAt}
                maxDateTime={new Date()}
                onChange={(newValue) => {
                  props.setEndAt(newValue);
                }}
              />
            </LocalizationProvider>
          </>
        )}
      </Content>
    </Box>
  );
}
