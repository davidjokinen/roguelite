import React, { useState, useEffect } from 'react';
import { CHAT_MESSAGE } from '../../../net/common/chat';

class ChatMessage extends React.Component {
  render() {
    if (this.props.user) {
      return(
        <p style={{margin: 0}}>
          {this.props.user}: {this.props.message}
        </p>
      );
    }
    return(
      <p style={{margin: 0}}>
        {this.props.message}
      </p>
    );
  }
};

class ChatMessageHistory extends React.Component {
  render() {      
     var createMessage = function(message, index) {
        var liStyles = {
           backgroundColor: ( index % 2 == 1 ) ? '#ddd' : '#efefef',
           padding: '5px',
           borderBottom: '1px solid #ddd'
        };
        return <li key={message.id} style={liStyles}><ChatMessage {...message} timestamp={message.sent} /></li>
     };
        
     var ulStyles = {
        listStyle: 'none',
        margin: 0,
        padding: 0
     };
     
     return <ul style={ulStyles}>{this.props.messages.map(createMessage)}</ul>;
  }
};   

 class ChatWindowOld extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      inputText: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const { sendMessage } = this.props;
    sendMessage({ message: this.state.inputText });
    this.setState({inputText: '' });
  }
  componentDidMount() {
    // const { onMessage } = this.props;
    // onMessage.on(message => {
    //   var nextMessages = this.state.messages.concat([message]);
    //   this.setState({ messages: nextMessages});
    // });
  }
  onChange(e) {
    this.setState({inputText: e.target.value});
  }
  render() {
    
     
     return (
        <div style={windowStyles}>
           <ChatMessageHistory messages={this.state.messages} />
           <form style={formStyles} onSubmit={this.handleSubmit}>
              <input style={inputStyles} type="text" onChange={this.onChange} value={this.state.inputText} />
              <button style={btnStyles}>Send</button>
           </form>
        </div>
     );
  }
};

var windowStyles = {
  maxWidth: '40em',
  margin: '1rem auto'
};

var formStyles = {
  display: 'flex',
};

var inputStyles = {
  flex: '1 auto'
};

var btnStyles = {
  backgroundColor: '#00d8ff',
  border: 'none',
  color: '#336699',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontWeight: 'bold',
  fontSize: '0.8em'
};

export default function ChatWindow(props) {
  const { components } = props;
  const [messages, setMessages] = React.useState([]);
  if (!components) return;

  const socket = components['socket'];

  React.useEffect(() => {
    socket.addOnMessage(CHAT_MESSAGE, (event, data) => {
      const newMessages = [...messages];
      newMessages.push(data);
      setMessages([...messages, data]);
    });

    return () => {
      socket.removeOnMessage(CHAT_MESSAGE);
    };
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let message = e.target.elements.message.value;
    e.target.elements.message.value = '';
    socket.send(CHAT_MESSAGE, message);
  };
  
  return (
    <div style={windowStyles}>
      <ChatMessageHistory messages={messages} />
      <form style={formStyles} onSubmit={handleSubmit}>
        <input style={inputStyles} name="message" type="text" />
        <button style={btnStyles}>Send</button>
      </form>
    </div>
  );
}