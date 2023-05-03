import styles from '../project/ProjectForm.module.css'
import { useState } from 'react'
import SubmitButton from '../form/SubmitButton'
import Input from '../form/Input'


function ServiceForm({ handleSubmit, btnText, projectData}){

    const [service, setService] = useState({})

    function submit(e) {
        e.preventDefault()
    
        
        const services = projectData.services || []
    
       
        services.push(service)
    
     
        const updatedProjectData = { ...projectData, services }
   
       
        handleSubmit(updatedProjectData)
    }
    

    function handleChange(e){
setService({...service, [e.target.name]:e.target.value})
    }
return (
    <form onSubmit={submit} className={styles.form}>
<Input
type="text" 
text="Nome do serviço"
name="name"
placeholder="Insira o nome do serviço"
handleOnChange={handleChange}
/>
<Input 
type="number" required 
text="Custo do serviço"
name="cost"
placeholder="Insira o valor total"
handleOnChange={handleChange}
/>
<Input
type="text"
text="Descrição do serviço"
name="description"
placeholder="Descreva o serviço"
handleOnChange={handleChange}
/>
<SubmitButton text={btnText}/>
    </form>
)
}

export default ServiceForm