import { Badge, Button, Col, Row, Stack } from "react-bootstrap"
import { useNote } from "./NoteLayout"
import { Link, useNavigate } from "react-router-dom"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"

type Props = {
     onDeleteNote:(id:string) => void
}

const Note = ({onDeleteNote}: Props) => {
     const note = useNote()
     const navigate = useNavigate()
  return (<>
    <Row className="align-items-center mb-4">
          <Col>
               <h1>{note.title}</h1>
               {note.tags.length > 0 && (
                    <Stack gap={1} direction="horizontal" className="flex-wrap">
                    {note.tags.map(tag =>(
                         <Badge className="text-truncate" key={tag.id}>
                              {tag.label}
                         </Badge>
                    ))}
               </Stack>
               )}
          </Col>
          <Col xs='auto'>
               <Stack direction='horizontal' gap={2}>
                    <Link to={`/${note.id}/edit`}>
                         <Button variant="primary">Edit</Button>
                    </Link>
                    <Button variant="outline-danger" onClick={()=>{
                         onDeleteNote(note.id)
                         navigate("/")} 
                         }>
                         Delete
                         </Button>
                    <Link to="/">
                    <Button variant="outline-secondary">Back</Button>
                    </Link>
               </Stack>
          </Col>
    </Row>
    <ReactMarkdown>{note.markdown}</ReactMarkdown>
    </>
  )
}

export default Note