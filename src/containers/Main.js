import React, { useState, useEffect } from "react";
import "@aws-amplify/ui-react/styles.css";
import {
  Button,
  Flex,
  Heading,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Text,
  View,
} from "@aws-amplify/ui-react";
import { listEvents } from "../graphql/queries";
import {
  deleteEvent as deleteEventMutation,
  updateEvent as updateEventMutation,
} from "../graphql/mutations";
import { generateClient } from 'aws-amplify/api';
import "react-datepicker/dist/react-datepicker.css";
import Header from "../components/Header/Header";
import CreateEventForm from "../components/CreateEventForm/CreateEventForm";

const client = generateClient();

const Main = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editableEventId, setEditableEventId] = useState('');
  const [editableEventName, setEditableEventName] = useState('');
  const [editableEventDescription, setEditableEventDescription] = useState('');
  const [editableEventDate, setEditableEventDate] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const apiData = await client.graphql({ query: listEvents });
      setEvents(apiData.data.listEvents.items);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

  async function deleteEvent(id) {
    try {
      await client.graphql({
        query: deleteEventMutation,
        variables: { input: { id } },
      });
      setEvents(events.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }

  async function updateEvent(id) {
    try {
      await client.graphql({
        query: updateEventMutation,
        variables: {
          input: {
            id,
            name: editableEventName,
            description: editableEventDescription,
            date: editableEventDate,
          },
        },
      });
      setEditableEventId('');
      setEditableEventName('');
      setEditableEventDescription('');
      setEditableEventDate('');
      fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  }

  function handleSearch(event) {
    setSearchQuery(event.target.value);
  }

  function handleEdit(id, name, description, date) {
    setEditableEventId(id);
    setEditableEventName(name);
    setEditableEventDescription(description);
    setEditableEventDate(date);
  }

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="main-wrapper">
      <Header/>

      <Flex justifyContent={"space-between"} alignItems={"flex-start"}>
        <View margin="3rem">
          <Heading margin="1rem 0" color="#808080" level={2}>Current Events</Heading>
          <Input
            margin="1rem 0"
            type="text"
            placeholder="Search events"
            value={searchQuery}
            onChange={handleSearch}
            disabled={!filteredEvents.length}
          />


          {filteredEvents.length > 0 ?
            (<Table
              caption=""
              highlightOnHover={true}
              variation="striped">
              <TableHead>
                <TableRow>
                  <TableCell as="th">Event name</TableCell>
                  <TableCell as="th">Description</TableCell>
                  <TableCell as="th">Date</TableCell>
                  <TableCell as="th">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      {editableEventId === event.id ? (
                        <Input
                          value={editableEventName}
                          onChange={(e) => setEditableEventName(e.target.value)}
                        />
                      ) : (
                        <Text>{event.name}</Text>
                      )}
                    </TableCell>
                    <TableCell>
                      {editableEventId === event.id ? (
                        <Input
                          value={editableEventDescription}
                          onChange={(e) => setEditableEventDescription(e.target.value)}
                        />
                      ) : (
                        <Text>{event.description}</Text>
                      )}
                    </TableCell>
                    <TableCell>
                      {editableEventId === event.id ? (
                        <Input
                          value={editableEventDate}
                          onChange={(e) => setEditableEventDate(e.target.value)}
                        />
                      ) : (
                        <Text>{event.date}</Text>
                      )}
                    </TableCell>
                    <TableCell>
                      {editableEventId === event.id ? (
                        <>
                          <Button onClick={() => updateEvent(event.id)}>Save</Button>
                          <Button onClick={() => setEditableEventId('')}>Cancel</Button>
                        </>
                      ) : (
                        <Button onClick={() => handleEdit(event.id, event.name, event.description, event.date)}>Edit</Button>
                      )}
                      <Button onClick={() => deleteEvent(event.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>))}
              </TableBody>
            </Table>) : <Heading marginTop="1rem" level={5}>No Events added yet!</Heading>
          }
        </View>
        <CreateEventForm fetchEvents={ fetchEvents } />
      </Flex>

    </View>
  );
}

export default Main;
