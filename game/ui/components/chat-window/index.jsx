import React, { useState, useEffect } from 'react';

class ChatMessage extends React.Component {
  render() {
    if (this.props.username) {
      return(
        <p style={{margin: 0}}>
          {this.props.username}: {this.props.message}
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
        
        return <li key={message.key} style={liStyles}><ChatMessage username={message.username} message={message.message} timestamp={message.sent} /></li>
     };
        
     var ulStyles = {
        listStyle: 'none',
        margin: 0,
        padding: 0
     };
     
     return <ul style={ulStyles}>{this.props.messages.map(createMessage)}</ul>;
  }
};   

export default class ChatWindow extends React.Component {
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