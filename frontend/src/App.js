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
    let auth = document.getElementById("auth").value;
    if (pass.length > 3 && name.length > 3 && name.length<=12 && auth) {
      fetch("/create", {
        method: "POST",
        body: JSON.stringify({ username: name, password: pass, reg: auth })
      })
        .then(x => x.text())
        .then(y => {
          y === "success" ? alert("Account created") : alert("Failure");
        });
    } else {
      alert("DOES NOT MEET ACCOUNT CREATION REQUIREMENTS\nUSERNAME MUST BE LONGER THAN 3 CHARACTERS AND SHORTER THAN 12");
    }
    document.getElementById("creNam").value = "";
    document.getElementById("crePas").value = "";
    document.getElementById("auth").value='';
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
          console.log(y)
        
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
          <div className="topbar">
            <img src="/RandyChat.png" alt={""} id="top" /> RandyChat
          </div>
          <div className="flex">
            <div className="login">
              <div className="header" style={{ fontSize: "13pt" }}>
                LOG IN?<br />
              </div>

              <form autocomplete="off" onSubmit={this.handleLogin}>
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
              <form autocomplete="off" onSubmit={this.handleCreate}>
                USERNAME:<br />
                <input type="text" id="creNam" placeholder="USERNAME" />
                <br />PASSWORD:<br />
                <input type="password" id="crePas" placeholder="PASSWORD" />
                <br />
                REGISTRATION KEY<br />
                <input type="text" id="auth" placeholder="REGISTRATION CODE" />
                <br />
                <input className="logbut" type="submit" />
              </form>
            </div>
          </div>
        </div>;
    } else {
      return <div className="body">
          <div className="topbar">
            <img src="/RandyChat.png" alt={""}  id="top" /> RandyChat
          </div>
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
              <form autocomplete="off" onSubmit={this.handleSubmit}>
                <input className="chatbar" type="text" onChange={this.handleChange} id="inp" />
                <input type="submit" id="subbut" />
              </form>
            </div>
          </div>
          <div className="actives">
            <ul>
              <div className="header">ACTIVE USERS</div>
              {this.state.actives.map((x, k) => (
                <li className="users" key={k}>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="pics">
            <img className="gifs" alt={""} src="https://media1.tenor.com/images/79e1992b9a22c8fd96e70273762f9089/tenor.gif?itemid=4690488" />
            <img className="gifs" alt={""} src="http://78.media.tumblr.com/f700e72f1cf0a4da97498a04d0fb6a73/tumblr_nel5yglC461rs4yfmo1_500.gif" />
            <img className="gifs" alt={""} src="https://78.media.tumblr.com/810c61343c24ea8ca3683e8a52f9c7d0/tumblr_oj5px2pGXF1vgh64ho1_500.gif" />
          </div>
        </div>;
    }
  }
}

export default App;
