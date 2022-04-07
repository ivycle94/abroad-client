import React, { useState, useEffect } from 'react'
import { getOneVisit, updateVisited, removeVisited } from '../../api/visit'
import { useParams, useNavigate } from 'react-router-dom'
import { Spinner, Container, Card, Button } from 'react-bootstrap'
import { showVisitedSuccess, showVisitedFailure, removeVisitSuccess, removeVisitFailure } from '../shared/AutoDismissAlert/messages'
import EditVisitedModal from './EditVisitedModal'
import Moment from 'react-moment';
// import moment from 'moment';


const ShowVisited = (props) => {
    const [visited, setVisited] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [updated, setUpdated] = useState(false)
    const { user, msgAlert } = props
    const { id } = useParams()
    const navigate = useNavigate()
    // IVY -> trying to chnage time format here
    // let visitFromDate = moment(visited.visitFromDate, "DD-MM-YYYY")
    // console.log("this is the formatted date", visitFromDate)
    // console.log('id in showVisited', id)

    // empty dependency array in useEffect to act like component did mount
    useEffect(() => {
        getOneVisit(id)
            .then(res =>

                setVisited(res.data.visit)
            )
            .then(() => {
                msgAlert({
                    heading: 'The spooky visit has been retrieved!',
                    message: showVisitedSuccess,
                    variant: 'success',
                })
            })
            .catch(() => {
                msgAlert({
                    heading: 'Failed to find the spooky visit',
                    message: showVisitedFailure,
                    variant: 'danger',
                })
            })
    }, [updated])

    // const getDestination
    const removeTheVisited = () => {
        // console.log("removeTheVisited id", visited.id)

        removeVisited(user, visited._id)
            .then(() => {
                msgAlert({
                    heading: 'The spooky visited has been removed!',
                    message: removeVisitSuccess,
                    variant: 'success',
                })
            })
            .then(() => { navigate(`/myvisits/${user._id}`) })
            .catch(() => {
                msgAlert({
                    heading: 'Spooky Visited deletion failed.',
                    message: removeVisitFailure,
                    variant: 'danger',
                })
            })
    }



    if (!visited) {
        return (
            <Container fluid className="justify-content-center">
                <Spinner animation="border" role="status" variant="warning" >
                    <span className="visually-hidden">Loading....</span>
                </Spinner>
            </Container>
        )
    }


    return (
        <>
            <Container className="fluid">
                <Card>
                    <Card.Header>
                        Visit to {visited.destination.name}
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                            <small>Description: {visited.description}</small><br />
                            <small>rating: {visited.visitRating}</small><br />
                            <small>Date from: <Moment format="dddd MMMM YYYY">{visited.visitFromDate}</Moment></small><br />
                            <small>Date to: <Moment format="dddd MMMM YYYY">{visited.visitToDate}</Moment></small><br />
                            {/* <small>Date to: {visited.visitToDate}</small><br /> */}
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <Button onClick={() => setModalOpen(true)} className="m-2" variant="warning">
                            Edit Visited
                        </Button>
                        <Button onClick={() => removeTheVisited()} className="m-2" variant="danger">
                            Delete Visited
                        </Button>
                    </Card.Footer>
                </Card>
            </Container>
            <EditVisitedModal
                visit={visited}
                show={modalOpen}
                user={user}
                msgAlert={msgAlert}
                triggerRefresh={() => setUpdated(prev => !prev)}
                updateVisited={updateVisited}
                handleClose={() => setModalOpen(false)}
            />
        </>
    )
}

export default ShowVisited