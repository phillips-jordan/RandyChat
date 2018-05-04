import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      username: undefined,
      textinput: "",
      messages: [],
      loggedin: false,
      sessionID: undefined,
      enterchat: false,
      actives: []
    };
  }
  componentDidMount = () => {
    setInterval(
      ()=>{
      fetch("/messages")
        .then(x => x.text())
        .then(y => {
          let parsedY = JSON.parse(y);
          if (this.state.loggedin && this.state.messages.length!=parsedY.length) {
            this.updateScroll();
          }
          this.setState({ messages: parsedY })
        });
      fetch("/activeUsers")
                .then(x => x.text())
                .then(y => {
                  let parsedY = JSON.parse(y);
                  this.setState({ actives: parsedY });
                  
                })}
        ,
      600
    );

    
  };

  updateScroll = ()=>{
    var element = document.getElementById("chat");
    element.scrollTop = element.scrollHeight;
}

  handleSubmit = e => {
    e.preventDefault();
    fetch("/submit", {
      method: "POST",
      body: JSON.stringify({
        username: this.state.username,
        message: this.state.textinput,
        id: this.state.sessionID,
        time: new Date().getTime()
      })
    })
      .then(x => x.text())
      .then(y => {
        let parsedY = JSON.parse(y);
        this.setState({ messages: parsedY, textinput: "" });
      });
      this.updateScroll();
    document.getElementById("inp").value = "";
  };

  handleChange = e => {
    let input = e.target.value;
    this.setState({ textinput: input });
  };

  

  handleCreate = e => {
    e.preventDefault();
    let name = document.getElementById("creNam").value;
    let pass = document.getElementById("crePas").value;
    if (pass.length > 3 && name.length > 3 && name.length<=12) {
      fetch("/create", {
        method: "POST",
        body: JSON.stringify({ username: name, password: pass })
      })
        .then(x => x.text())
        .then(y => {
          y === "success" ? alert("Account created") : alert("Username Taken");
        });
    } else {
      alert("PASSWORD OR USERNAME DOES NOT MEET ACCOUNT CREATION REQUIREMENTS\nUSERNAME MUST BE LONGER THAN 3 CHARACTERS AND SHORTER THAN 12");
    }
    document.getElementById("creNam").value = "";
    document.getElementById("crePas").value = "";
  };

  handleLogin = e => {
    e.preventDefault();
    let name = document.getElementById("username").value;
    let pass = document.getElementById("pass").value;
    if (pass && name) {
      fetch("/login", {
        method: "POST",
        body: JSON.stringify({ username: name, password: pass })
      })
        .then(x => x.text())
        .then(y => {
          let parsedY = JSON.parse(y);
          if (parsedY.out === "success") {
            this.setState({
              loggedin: true,
              sessionID: parsedY.id,
              username: name,
              messages: parsedY.msgs
            })
            this.updateScroll();
          ;
          } else {
            alert("INCORRECT");
            document.getElementById("pass").value = '';
            document.getElementById("username").value = '';
          }
        });
    } else {
      alert("INCORRECT")
      document.getElementById("pass").value = "";
      document.getElementById("username").value = "";
    }
  };

  render() {
    if (!this.state.loggedin) {
      return <div className="body">
          <div className="topbar">RandyChat</div>
          <div className='flex'>
          <div className="login">
            <div className="header" style={{ fontSize: "13pt" }}>
              LOG IN?<br/>
            </div>

            <form onSubmit={this.handleLogin}>
              USERNAME:<br />
              <input type="text" id="username" placeholder="USERNAME" />
              <br />PASSWORD:<br />
              <input type="password" id="pass" placeholder="PASSWORD" />
              <br />
              <input className="logbut" type="submit" />
            </form>
          </div>
          <div className="create">
            <div className="header" style={{ fontSize: "13pt" }}>
              CREATE ACCOUNT?
            </div>
            <form onSubmit={this.handleCreate}>
              USERNAME:<br />
              <input type="text" id="creNam" placeholder="USERNAME" />
              <br />PASSWORD:<br />
              <input type="password" id="crePas" placeholder="PASSWORD" />
              <br />
              <input className="logbut" type="submit" />
            </form>
          </div>
          </div>
        </div>;
    } else {
      return <div className="body">
      <div className='topbar'>RandyChat</div>
          <div className="chat">
            <div className="top" id="chat">
              <ul>
                {this.state.messages.map((x, k) => (
                  <li key={k}>
                    {x.username
                      ? x.username + ": " + x.message
                      : "" + x.message}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bottom">
              <form onSubmit={this.handleSubmit}>
                <input className="chatbar" type="text" onChange={this.handleChange} id="inp" />
                <input type="submit" id='subbut'/>
              </form>
            </div>
          </div>
          <div className="actives">
            <ul >
              <div className='header'>ACTIVE USERS</div>
              {this.state.actives.map((x, k) => <li key={k}>{x}</li>)}
            </ul>
          </div>
        </div>;
    }
  }
}

export default App;
