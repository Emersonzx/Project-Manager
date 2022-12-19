import {Link} from 'react-router-dom'
import Container from './Container.js'
import styles from './Navbar.module.css'
import logo from '../../img/coin.png'

function Navbar(){
 return (
     <nav className={styles.navbar}>
          <Container>
                <Link to="/" >
                  <img src={logo} alt="Costs"/>
               </Link>
             <ul className={styles.list}>
                  <li class={styles.item}>
                      <Link to="/">Home</Link>
                   </li> 
                   <li className={styles.item}>
                      <Link to="/projects">Projetos</Link>
                   </li>  
                   <li className={styles.item}>
                        <Link to="/company">Empresa</Link>
                    </li>    
                   <li className={styles.item}>
                       <Link to="/contact">Contato</Link>
                   </li>    
             </ul>
          </Container>
      </nav>      
   )
}

export default Navbar