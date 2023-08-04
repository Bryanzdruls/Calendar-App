import React, { useEffect, useMemo, useState } from 'react'
import Modal from 'react-modal'
import { addHours, differenceInSeconds } from 'date-fns';
import Swal from 'sweetalert2';
import DatePicker, {registerLocale} from "react-datepicker";
import { useCalendarStore, useUiStore, } from '../../hooks';


import es from 'date-fns/locale/es';

import 'sweetalert2/dist/sweetalert2.min.css'
import "react-datepicker/dist/react-datepicker.css";


registerLocale('es',es)
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');

export const CalendarModal = () => {
    const { isDateModalOpen, closeDateModal } = useUiStore();
    const { activeEvent,startSavingEvent }=useCalendarStore();
    const [formSubmitted, setFormSubmitted] = useState(false);

    const [formValues, setFormValues] = useState({
        title: 'Bolder',
        notes: 'Torres',
        start: new Date(),
        end: addHours(new Date(), 2),
    });

    const titleClass = useMemo(() =>{ 
        if(!formSubmitted) return '';
        return ( formValues.title.length>0)
            ?'is-valid'
            :'is-invalid'
    }, [formValues.title,formSubmitted])
    
    
    const onInputChange = ({target}) =>{
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }
    const onDateChanged = (date,changing) =>{
        setFormValues({
            ...formValues,
            [changing]: date
        })
    }
    const onCloseModal = () => {
        closeDateModal();
        
    }
    const onSubmit= async(event) =>{
        event.preventDefault();
        setFormSubmitted(true);
        const diff = differenceInSeconds(formValues.end, formValues.start);
        if (diff <=0 || isNaN(diff)) { 
            Swal.fire('Fechas Incorrectas','Revisar las fechas','error')
            return;
        }
        if (formValues.title.length <=0)  return;

        //TODO CERRARMODAL RESOLVER ERRORES
        await startSavingEvent( formValues );
        closeDateModal();
        setFormSubmitted(false);
        
    }
    useEffect(() => {
      if(activeEvent != null){
        setFormValues({...activeEvent});
      }
    
    }, [ activeEvent ])
    
    return (
        <Modal
            isOpen={isDateModalOpen}
            onRequestClose={onCloseModal}
            style={customStyles}
            className='modal'
            overlayClassName='modal-fondo'
            closeTimeoutMS={200}
        >
            <h1> Nuevo evento </h1>
            <hr />
            <form className="container" onSubmit={onSubmit}>

                <div className="form-group mb-2">
                    <label>Fecha y hora inicio</label>
                    <DatePicker 
                        selected={formValues.start} 
                        onChange={(date) => onDateChanged(date, 'start')}
                        className='form-control'
                        dateFormat='Pp'
                        showTimeSelect
                        locale={'es'}
                        timeCaption='Hora'
                     />
                </div>

                <div className="form-group mb-2">
                    <label>Fecha y hora fin</label>
                    <DatePicker 
                        minDate={formValues.start}
                        selected={formValues.end} 
                        onChange={(date) => onDateChanged(date, 'end')}
                        className='form-control'
                        dateFormat='Pp'
                        showTimeSelect
                        locale={'es'}
                        timeCaption='Hora'                       
                     />
                </div>

                <hr />
                <div className="form-group mb-2">
                    <label>Titulo y notas</label>
                    <input
                        type="text"
                        className={`form-control ${titleClass}`}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={formValues.title}
                        onChange={onInputChange}
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group mb-2">
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={formValues.notes}
                        onChange={onInputChange}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>
        </Modal>

    )
}
