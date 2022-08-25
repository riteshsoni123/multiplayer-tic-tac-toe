import React from "react";
import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const socket = io.connect("http://localhost:8000");

function Game() {
  const checkResult = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const [count, setCount] = useState(0);
  const [createCode, setCreateCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [turn, setTurn] = useState(true);
  const [winner, setWinner] = useState("");
  const winningCharacter = useRef("X");
  const [data, setData] = useState([
    {
      id: "00",
      value: "",
    },
    {
      id: "01",
      value: "",
    },
    {
      id: "02",
      value: "",
    },
    {
      id: "10",
      value: "",
    },
    {
      id: "11",
      value: "",
    },
    {
      id: "12",
      value: "",
    },
    {
      id: "20",
      value: "",
    },
    {
      id: "21",
      value: "",
    },
    {
      id: "22",
      value: "",
    },
  ]);

  const resultChecker = (data) => {
    for (var i = 0; i < checkResult.length; i++) {
      if (
        data[checkResult[i][0]].value === data[checkResult[i][1]].value &&
        data[checkResult[i][1]].value === data[checkResult[i][2]].value &&
        data[checkResult[i][0]].value !== ""
      ) {
        if (winningCharacter.current === data[checkResult[i][0]].value) {
          setWinner("You won the Game");
        } else {
          setWinner("Your opponent won the Game");
        }
        setTurn(false);
        break;
      }
    }
  };
  useEffect(() => {
    socket.on("recieveData", (data) => {
      setData(data.data);
      setCount(data.tmp);
      setTurn(true);
      resultChecker(data.data);
    });
    return () => {
      socket.off("recieveData");
    };
  }, []);

  useEffect(() => {
    socket.on("recieveCoinToss", (data) => {
      if (!data.value) {
        winningCharacter.current = "O";
        setTurn(false);
      }
    });
    return () => {
      socket.off("recieveCoinToss");
    };
  }, []);

  const coinToss = () => {
    var num = Math.floor(Math.random() * 1000);
    if (num % 2 === 0) {
      socket.emit("sendCoinToss", { value: false, joinCode });
    } else {
      setTurn(false);
      winningCharacter.current = "O";
    }
  };

  const handleClick = (key) => {
    if (!turn) return;
    for (var i = 0; i < 9; i++) {
      if (data[i].id === key && data[i].value === "") {
        if (count % 2 === 0) {
          data[i].value = "X";
        } else {
          data[i].value = "O";
        }
        break;
      }
    }
    setData(data);
    const tmp = count + 1;
    socket.emit("sendData", { data, tmp, joinCode });
    setCount(count + 1);
    setTurn(false);
    resultChecker(data);
  };

  const generateCode = (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const createJoinCode = () => {
    const code = generateCode(10);
    setCreateCode(code);
    setJoinCode(code);
    socket.emit("create_room", code);
  };

  const joinGame = (e) => {
    e.preventDefault();
    setCreateCode(joinCode);
    socket.emit("join_room", joinCode);
    coinToss();
  };

  return (
    <>
      <Container>
        <Row>
          <Col className="d-flex align-items-center justify-content-center">
            {turn && winner.length === 0 && <div>Your Turn</div>}
            {!turn && winner.length === 0 && <div>Opponent's Turn</div>}
            {winner.length > 0 && <div>{winner}</div>}
          </Col>
        </Row>
        <Row
          style={{
            margin: "0% 25% 0% 25%",
          }}
        >
          {data
            .filter(function (val) {
              return val.id === "00" || val.id === "01" || val.id === "02";
            })
            .map((val) => {
              return (
                <Col
                  className="border border-primary d-flex align-items-center justify-content-center"
                  style={{
                    height: "150px",
                    margin: "1% 1% 1% 1%",
                  }}
                  onClick={() => handleClick(val.id)}
                  key={val.id}
                >
                  <span
                    className="text-center"
                    style={{
                      fontSize: 150,
                    }}
                  >
                    {val.value}
                  </span>
                </Col>
              );
            })}
        </Row>
        <Row
          style={{
            margin: "0% 25% 0% 25%",
          }}
        >
          {data
            .filter(function (val) {
              return val.id === "10" || val.id === "11" || val.id === "12";
            })
            .map((val) => {
              return (
                <Col
                  className="border border-primary d-flex align-items-center justify-content-center"
                  style={{
                    height: "150px",
                    margin: "1% 1% 1% 1%",
                  }}
                  onClick={() => handleClick(val.id)}
                  key={val.id}
                >
                  <span
                    className="text-center"
                    style={{
                      fontSize: 150,
                    }}
                  >
                    {val.value}
                  </span>
                </Col>
              );
            })}
        </Row>
        <Row
          style={{
            margin: "0% 25% 0% 25%",
          }}
        >
          {data
            .filter(function (val) {
              return val.id === "20" || val.id === "21" || val.id === "22";
            })
            .map((val) => {
              return (
                <Col
                  className="border border-primary d-flex align-items-center justify-content-center"
                  style={{
                    height: "150px",
                    margin: "1% 1% 1% 1%",
                  }}
                  onClick={() => handleClick(val.id)}
                  key={val.id}
                >
                  <span
                    className="text-center"
                    style={{
                      fontSize: 150,
                    }}
                  >
                    {val.value}
                  </span>
                </Col>
              );
            })}
        </Row>
        <Row>
          <Col className="d-flex align-items-center justify-content-center">
            <Form onSubmit={joinGame}>
              <Form.Group className="mb-3">
                <Form.Label>Secret Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Code"
                  id="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                />
                <Form.Text className="text-muted">{createCode}</Form.Text>
              </Form.Group>

              <Form.Group>
                <Button variant="primary" type="submit">
                  Join Game
                </Button>
                <Button
                  className="mx-5"
                  onClick={createJoinCode}
                  variant="primary"
                >
                  Create Game
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Game;
