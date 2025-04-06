import React, { useState } from "react";
import Modal from "./modal";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import EditMedicine from "@/app/account/medicine/EditMedicine";
import DeleteMedicine from "@/app/account/medicine/DeleteMedicine";
import Prescription from "@/app/account/orders/prescription";
type Props = {
  edit?: boolean;
  isDelete?: boolean;
  presc?: string;
};
const ModalParent = ({ edit, isDelete, presc }: Props) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
  };
  const handleOpen = () => {
    setShowModal(true);
  };
  const actionBar = (
    <div>
      <button
        onClick={ handleClose }
        className="cursor-pointer text-2xl pr-5 pt-3 text-black  font-sans hover:text-red-500  transition-all duration-500"
      >
        x
      </button>
    </div>
  );

  const modal = (
    <Modal onClose={ handleClose } actionBar={ actionBar } isDelete={ isDelete }>
      { edit ? <EditMedicine /> : isDelete ? <DeleteMedicine /> : <Prescription /> }
    </Modal>
  );
  return (
    <div>
      { edit ?
        <FaEdit onClick={ handleOpen } className='flex cursor-pointer text-green-400/90 justify-center items-center' />
        : presc ?
          <div className="flex gap-1 items-center cursor-pointer transition-all duration-300 hover:text-primary-100">
            <FaEye />
            <button onClick={ handleOpen } className=" cursor-pointer">Check Prescription</button>
          </div>
          :

          <FaTrash onClick={ handleOpen } className='flex cursor-pointer text-red-400/90 justify-center items-center' />
      }
      { showModal && modal }
    </div>
  );
};
export default ModalParent;