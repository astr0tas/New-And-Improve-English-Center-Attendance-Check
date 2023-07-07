import styles from './ClassList.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { DMY } from '../../../../tools/dateFormat';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { domain } from '../../../../tools/domain';

const Class = (props) =>
{
      const [currentStudents, setCurrentStudents] = useState(0);
      const [currentSessions, setCurrentSessions] = useState(0);

      useEffect(() =>
      {
            axios.post(`http://${ domain }/admin/getCurrentStudent`, { params: { name: props.name } })
                  .then(res =>
                  {
                        setCurrentStudents(res.data.currentStudents);
                  })
                  .catch(err => console.error(err));

            axios.post(`http://${ domain }/admin/getCurrentSession`, { params: { name: props.name } })
                  .then(res =>
                  {
                        setCurrentSessions(res.data.currentSessions);
                  })
                  .catch(err => console.error(err));
      }, [props.name])

      return (
            <tr className={ `${ styles.hover }` } onClick={ () => { props.Navigate(`./${ props.name }`); } }>
                  <td className='text-center'>{ props.i }</td>
                  <td className='text-center'>{ props.name }</td>
                  <td className='text-center'>{ currentStudents }/{ props.initialStudents }</td>
                  <td className='text-center'>{ currentSessions }/{ props.initialSessions }</td>
                  <td className='text-center'>{ DMY(props.start) }</td>
                  <td className='text-center'>{ DMY(props.end) }</td>
                  <td className='text-center' style={ { color: props.status === 0 ? 'red' : '#128400' } }>{ props.status === 0 ? 'Deactivated' : 'Active' }</td>
            </tr>
      )
}

const ClassList = () =>
{
      document.title = 'Class List';

      const [tableContent, setTableContent] = useState([]);
      const [name, setName] = useState("");
      const [status, setStatus] = useState(1);
      const Navigate = useNavigate();

      let timer1;

      useEffect(() =>
      {
            axios.post(`http://${ domain }/admin/classList`, { params: { name: name, status: status } })
                  .then(res =>
                  {
                        const temp = [];
                        for (let i = 0; i < res.data.length; i++)
                              temp.push(<Class key={ i } i={ i + 1 } Navigate={ Navigate }
                                    initialStudents={ res.data[i].Max_students } initialSessions={ res.data[i].Initial_sessions } name={ res.data[i].Name }
                                    start={ res.data[i].Start_date } end={ res.data[i].End_date } status={ res.data[i].Status } />);
                        setTableContent(temp);
                  })
                  .catch(err => console.log(err));
      }, [name, Navigate, status]);

      const findClass = (e) =>
      {
            clearTimeout(timer1);

            timer1 = setTimeout(() =>
            {
                  setName(e.target.value);
            }, 1500);
      }

      const changeStatus = (val) =>
      {
            setStatus(val);
      }

      return (
            <div className='w-100 h-100 d-flex flex-column'>
                  <div className='mt-4 mt-md-2 me-md-auto ms-md-3 mx-auto d-flex align-items-center flex-column flex-sm-row'>
                        <div className='mb-3 mb-sm-0'>
                              <FontAwesomeIcon icon={ faMagnifyingGlass } className={ `position-absolute ${ styles.search }` } />
                              <input type='text' placeholder='Find class' className={ `ps-4` } onChange={ findClass }></input>
                        </div>
                        <div className='ms-3 d-flex align-items-center'>
                              <strong>Status</strong>
                              <div className='d-flex align-items-center'>
                                    <input type="radio" id="active" name="status" value={ 1 } className={ `ms-2 me-1 ${ styles.hover } ${ styles.radios }` } onChange={ () => changeStatus(1) } checked={ status === 1 } />
                                    <label htmlFor="active" className={ `me-3` } style={ { color: '#128400' } }>Active</label>
                              </div>
                              <div className='d-flex align-items-center'>
                                    <input type="radio" id="deactivated" name="status" value={ 0 } className={ `me-1 ${ styles.hover } ${ styles.radios }` } onChange={ () => changeStatus(0) } checked={ status === 0 } />
                                    <label htmlFor="deactivated" style={ { color: 'red' } }>Deactivated</label>
                              </div>
                        </div>
                  </div>
                  <div className={ `flex-grow-1 w-100 overflow-auto mt-3 px-md-2 mb-3` }>
                        <table className="table table-hover table-info" style={ { borderCollapse: 'separate' } }>
                              <thead style={ { position: "sticky", top: "0" } }>
                                    <tr>
                                          <th scope="col" className='col-1 text-center'>#</th>
                                          <th scope="col" className='col-4 text-center'>Name</th>
                                          <th scope="col" className='col-1 text-center'>Students</th>
                                          <th scope="col" className='col-1 text-center'>Sessions</th>
                                          <th scope="col" className='col-2 text-center'>Start date</th>
                                          <th scope="col" className='col-2 text-center'>End date</th>
                                          <th scope="col" className='col-1 text-center'>Status</th>
                                    </tr>
                              </thead>
                              <tbody>
                                    { tableContent }
                              </tbody>
                        </table>
                  </div >
            </div>
      )
}

export default ClassList;