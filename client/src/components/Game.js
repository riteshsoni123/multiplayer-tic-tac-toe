import React from "react";
import io from "socket.io-client";
import { useState, useCallback, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "../axios";

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

function Game() {
  const [socket, setSocket] = useState();
  const [count, setCount] = useState(0);
  const [turn, setTurn] = useState(true);
  const [winner, setWinner] = useState("");
  const [winningCharacter, setWinningCharacter] = useState("X");
  const [senderId, setSenderId] = useState(generateCode(10));
  const [recieverId, setRecieverId] = useState("");
  const inputRecieverId = useRef();
  const id = useRef();
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
  const fetchPrivateData = async () => {
    const config = {
      headers: {
        contentType: "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.get("/api/private", config);
      id.current = data._id;
    } catch (error) {
      localStorage.removeItem("authToken");
    }
  };

  const updateData = async (result) => {
    const config = {
      headers: {
        contentType: "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      await axios.post(`/api/private/updatedata/${id.current}`, result, config);
    } catch (error) {
      localStorage.removeItem("authToken");
    }
  };

  const resultChecker = useCallback(
    (data) => {
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
      const result = {
        won: false,
        lost: false,
        drawn: false,
      };
      for (var i = 0; i < checkResult.length; i++) {
        if (
          data[checkResult[i][0]].value === data[checkResult[i][1]].value &&
          data[checkResult[i][1]].value === data[checkResult[i][2]].value &&
          data[checkResult[i][0]].value !== ""
        ) {
          if (winningCharacter === data[checkResult[i][0]].value) {
            setWinner("You won the Game");
            result.won = true;
          } else {
            setWinner("Your opponent won the Game");
            result.lost = true;
          }
          updateData(result);
          setTurn(false);
          break;
        }
      }
    },
    [winningCharacter]
  );

  const recieveMessage = useCallback(
    (data) => {
      setCount(count + 1);
      setData(data.data);
      setTurn(true);
      resultChecker(data.data);
    },
    [count, resultChecker]
  );

  useEffect(() => {
    const newSocket = io("http://localhost:8000", {
      query: { senderId },
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [senderId]);

  useEffect(() => {
    if (socket == null) return;

    socket.on("recieveData", recieveMessage);

    return () => socket.off("recieveData");
  }, [socket, recieveMessage]);

  useEffect(() => {
    if (socket == null) return;

    socket.on("recieveCoinToss", (data) => {
      if (winningCharacter === "O") return;
      if (!data) {
        setWinningCharacter("O");
        setTurn(false);
      }
    });

    return () => socket.off("recieveCoinToss");
  }, [socket, winningCharacter, turn]);

  const coinToss = () => {
    var num = Math.floor(Math.random() * 1000);
    // var num = 22;
    if (num % 2 === 0) {
      socket.emit("sendCoinToss", { value: false, id: recieverId });
    } else {
      setTurn(false);
      setWinningCharacter("O");
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
    socket.emit("sendData", { data, count: count + 1, id: recieverId });
    setTurn(false);
    setCount(count + 1);
    resultChecker(data);
  };

  const joinGame = async (e) => {
    e.preventDefault();
    await fetchPrivateData();
    inputRecieverId.current = recieverId;
    if (winningCharacter === "O") return;
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
                  value={recieverId}
                  onChange={(e) => setRecieverId(e.target.value)}
                />
              </Form.Group>

              <Form.Group>
                <Button variant="primary" type="submit">
                  Join Game
                </Button>
                <div>
                  <Form.Text>Your Id: {senderId}</Form.Text>
                </div>
                <div>
                  <Form.Text>Opponent Id: {recieverId}</Form.Text>
                </div>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Game;
