import React from 'react';
import { Form, Button } from 'react-bootstrap';

const GetUserDetail = (props) => {
  const { socket, registrationConfirmation } = props;
  const [mobileNumber, setMobileNumber] = React.useState('1234567890');

  React.useEffect(() => {
    socket.on('checkUserDetailResponse', data => {
      registrationConfirmation(data);
    });
  }, [socket, registrationConfirmation])

  const submitMobileNumber = () => {
    socket.emit('checkUserDetail', { "mobileNumber": mobileNumber });
  };
  const onMobileNumberChange = (e) => {
    setMobileNumber(e.target.value);
  };

  return (
    <Form>
      <Form.Group>
        <Form.Label>Enter Your Mobile Number</Form.Label>
        <Form.Control type="number" value={mobileNumber} onChange={onMobileNumberChange} placeholder="Enter Mobile" />
        <Form.Text className="text-muted">
          Enter Your Mobile Number
                    </Form.Text>
        <Button disabled={mobileNumber.length !== 10} onClick={submitMobileNumber} variant="primary" type="button">
          Submit
                    </Button>
      </Form.Group>
    </Form>
  )
}

export default GetUserDetail;