import React,{useState} from "react";
const ModalContainer = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null; 
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>&times;</button>
          {children}
        </div>
      </div>
    );
};

const Modal = ({label,children}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {setIsModalOpen(true);};
    const closeModal = () => {setIsModalOpen(false);};
    return (
      <div>
        <button className="modal-entry-btn" onClick={openModal}>{label}</button>
        <ModalContainer isOpen={isModalOpen} onClose={closeModal}>{children}</ModalContainer>
      </div>
    );
};  
export default Modal;