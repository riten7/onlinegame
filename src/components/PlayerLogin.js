import React from 'react';
import { Form, Button } from 'react-bootstrap';

const PlayerLogin = (props) => {
  const { socket, registrationConfirmation } = props;
  const [playerName, setPlayerName] = React.useState('');

  React.useEffect(() => {
    socket.on('checkUserDetailResponse', data => {
      registrationConfirmation(data);
    });
  }, [socket, registrationConfirmation])

  const submitMobileNumber = () => {
    socket.emit('checkUserDetail', { "mobileNumber": playerName });
  };
  const onMobileNumberChange = (e) => {
    setPlayerName(e.target.value);
  };

  return (
    <Form>
      <Form.Group>
        <Form.Control type="text" value={playerName} onChange={onMobileNumberChange} placeholder="Enter your name" />
        <Button disabled={playerName.length < 5} onClick={submitMobileNumber} variant="primary" type="button">
          Submit
                    </Button>
      </Form.Group>
    </Form>
  )
}

export default  PlayerLogin;