import Message from '../layout/Message'
import {useLocation } from 'react-router-dom'
import styles from './Projects.module.css'
import Container from '../layout/Container'
import LinkButton from '../layout/LinkButton'
import ProjectCard from '../project/ProjectCard'
import {useState, useEffect } from 'react'
import Loading from '../layout/Loading'
import {onSnapshot, collection, doc, deleteDoc} from "firebase/firestore";
import {db} from '../firebase/firebase';



function Projects() {
  const [projects, setProjects] = useState([])
  const [removeLoading, setRemoveLoading] = useState(false)
  const [projectMessage, setProjectMessage] = useState('')

  const location = useLocation()
  let message = ''
  if (location.state) {
    message = location.state.message
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const projectsData = []
      snapshot.forEach((doc) => {
        const project = doc.data()
        project.id = doc.id
        projectsData.push(project)
      })
      setProjects(projectsData)
      setRemoveLoading(true)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  function removeProject(id) {
    const projectRef = doc(db, "projects", id);
    deleteDoc(projectRef)
      .then(() => {
        setProjects(projects.filter((project) => project.id !== id))
        setProjectMessage('Projeto removido com sucesso!')
      })
      .catch((error) => {
        console.log('Error removing document: ', error)
      })
  }
  return (
    <div className={styles.project_container}>
      <div className={styles.title_container}>
        <h1>Projetos</h1>
        <LinkButton to="/newproject" text="Criar Projeto" />
      </div>
      {message && <Message type="success" msg={message} />}
      {projectMessage && <Message type="success" msg={projectMessage} />}
      <Container customClass="start">
        {projects.length > 0 &&
          projects.map((project) => (
            <ProjectCard
              id={project.id}
              name={project.name}
              budget={project.budget}
              category={project?.category?.name}
              key={project.id}
              handleRemove={removeProject}
            />
          ))}
        {!removeLoading && <Loading />}
        {removeLoading && projects.length === 0 && <p>Não há projetos cadastrados!</p>}
      </Container>
    </div>
  )
}

export default Projects
