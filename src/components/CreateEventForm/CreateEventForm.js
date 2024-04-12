import React, {useState} from "react";
import {Button, Flex, Input, View} from "@aws-amplify/ui-react";
import DatePicker from "react-datepicker";
import {createEvent as createEventMutation} from "../../graphql/mutations";
import { generateClient } from 'aws-amplify/api';
import './CreateEventForm.css';

const client = generateClient();

const CreateEventForm = ({ fetchEvents }) => {
  const [selectedDate, setSelectedDate] = useState('');

  async function createEvent(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const description = event.target.description.value;
    const formattedDate = selectedDate.toLocaleString('en-GB'); // Format the selected date with time in HH:MM format
    try {
      await client.graphql({
        query: createEventMutation,
        variables: { input: { name, description, date: formattedDate } },
      });
      fetchEvents();
      event.target.reset();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  }

  return (
    <View as="form" margin="9rem 2rem 2rem" padding="2rem" border="2px solid #252525" borderRadius="10px" onSubmit={createEvent}>
      <Flex direction="column" justifyContent="center" >
        <Input
          type="text"
          name="name"
          placeholder="Event Name"
          required
        />
        <Input
          type="text"
          name="description"
          placeholder="Event Description"
          required
        />
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy HH:mm"
          showTimeSelect
          timeFormat="HH:mm"
          popperPlacement="left"
          placeholderText="Event Date"
        />
        <Button marginTop="2rem" type="submit" variation="primary">
          Create Event
        </Button>
      </Flex>
    </View>
  )
}

export default CreateEventForm;