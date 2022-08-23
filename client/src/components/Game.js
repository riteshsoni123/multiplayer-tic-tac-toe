import React from "react";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const socket = io.connect("http://localhost:8000");

function Game() {
  const [count, setCount] = useState(0);
  const [createCode, setCreateCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
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

  useEffect(() => {
    socket.on("recieveData", (data) => {
      setData(data.data);
      setCount(data.tmp);
    });
  }, []);

  const handleClick = (key) => {
    for (var i = 0; i < 9; i++) {
      if (data[i].id === key && data[i].value === "") {
        if (count % 2 === 0) {
          data[i].value = "X";
        } else {
          data[i].value = "O";
        }
        setData(data);
        const tmp = count + 1;
        socket.emit("sendData", { data, tmp, joinCode });
        setCount(count + 1);
        break;
      }
    }
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
  };

  return (
    <>
      <Container>
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

              <Form.Group className="mb-3">
                <Button variant="primary" type="submit">
                  Join Game
                </Button>
                <Button onClick={createJoinCode} variant="primary">
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
