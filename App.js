import { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Container, Row, Col } from 'react-native-flex-grid';

export default function App() {

  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState('Pick start date and time');
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedValue) => {
    const current = selectedValue || date;
    setShow(Platform.OS === 'ios');
    if (mode  === 'date') {
      handleDate(current);
    }
    else {
      handleTime(current);
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const isValidEndDay = (newDate) => {
    let start = startDate.split('.');
    let end = newDate.split('.');
    if (parseInt(end[2]) < parseInt(start[2])) {
      return false;
    }
    else if (parseInt(end[2]) === parseInt(start[2]) && 
      parseInt(end[1]) < parseInt(start[1])) {
      return false;
    }
    else if (parseInt(end[2]) === parseInt(start[2]) && 
      parseInt(end[1]) === parseInt(start[1]) && 
      parseInt(end[0]) < parseInt(start[0])) {
      return false;
    }
    else {
      return true; 
    }
  }

  const isValidEndTime = (newTime) => {
    if (startDate === endDate) {
      let start = startTime.split(':');
      let end = newTime.split(':');
      if (parseInt(end[0]) < parseInt(start[0])) {
        return false;
      }
      else if (parseInt(end[0]) === parseInt(start[0]) && 
        parseInt(end[1]) <= parseInt(start[1])) {
        return false;
      }
      else {
        return true; 
      }
    }
    else {
      return true;
    }
  }

  const handleDate = (current) => {
    let newDate = 
      current.getDate() + "." + 
      (current.getMonth() + 1) + "." + 
      current.getFullYear();
    if (startDate === '') {
      setStartDate(newDate);
    }
    else {
      if (isValidEndDay(newDate)) {
        setEndDate(newDate);
      }
      else {
        setStatus('Ends must be before starts');
      }
    }
  }

  const handleTime = (current) => {
    let hours = current.getHours().toString();
    let minutes = current.getMinutes().toString();
    if (hours.length === 1) {
      hours = '0' + hours;
    }
    if (minutes.length === 1) {
      minutes = '0' + minutes;
    }
    let newTime = hours + ":" + minutes;
    if (startTime === '') {
      setStartTime(newTime);
      setStatus('Pick end day and time');
    }
    else {
      if (isValidEndTime(newTime)) {
        setEndTime(newTime);
        setStatus('Well done!');
      }
      else {
        setStatus('Ends must be after starts');
      }
    }
  }

  const clearAll = () => {
    setStartDate('');
    setEndDate('');
    setStartTime('');
    setEndTime('');
    setStatus('Pick start date and time');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Booking</Text>
      <Text style={styles.time}>Starts: {startDate} {startTime}</Text>
      <Text style={styles.time}>Ends: {endDate} {endTime}</Text>
      <Text style={styles.time}>{status}</Text>
      <Container fluid>
        <Row>
          <Col>
            <View style={styles.picker}>
              <Button onPress={showDatepicker} title="Pick date" />
            </View>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
          </Col>
          <Col>
            <View style={styles.picker}>
              <Button onPress={showTimepicker} title="Pick time" />
            </View>
          </Col>
          <Col>
            <View style={styles.picker}>
              <Button onPress={clearAll} title="Clear" />
            </View>
          </Col>
        </Row>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    marginTop: 50,
    marginBottom: 10,
    fontSize: 30
  },
  picker: {
    marginTop: 30,
    marginBottom: 30,
    fontSize: 30
  },
  grid: {
    marginLeft: 30,
    marginRight: 30
  },
  time: {
    marginTop: 10,
    fontSize: 17
  }
});