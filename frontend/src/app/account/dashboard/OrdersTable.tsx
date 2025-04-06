"use client"
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { IoClose } from "react-icons/io5";
import { MdOutlineCheck } from "react-icons/md";
import ModalParent from '@/components/modalParent';
interface Column {
    id: 'name' | 'price' | 'category' | 'type' | 'status' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'right' | 'center' | 'left';
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    { id: 'name', label: 'Medicine Name', minWidth: 170 },
    { id: 'price', label: 'Price', minWidth: 100 },
    {
        id: 'category',
        label: 'Category',
        minWidth: 170,
        align: 'left',
        format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'type',
        label: 'Prescription ',
        minWidth: 170,
        align: 'left',
        format: (value: number) => value.toLocaleString('en-US'),
    },
    {
        id: 'status',
        label: 'Status',
        minWidth: 100,
        align: 'left',
        format: (value: number) => value.toFixed(2),
    },
    {
        id: 'actions',
        label: 'Actions',
        minWidth: 100,
        align: 'left',
        format: (value: number) => value.toFixed(2),
    },
];

interface Data {
    name: string;
    price: string;
    type: React.JSX.Element;
    category: string;
    status: React.JSX.Element;
    actions: React.JSX.Element;
}

function createData(
    name: string,
    price: string,
    type: React.JSX.Element,
    category: string,
    status: React.JSX.Element,
    actions: React.JSX.Element
): Data {
    return { name, price, type, category, status, actions };
}

const actionButton = (medicines: string) => {
    return (
        <div className="">

            { medicines === 'pending' ?
                <div className="flex gap-3 items-center">
                    <div className="p-1 bg-green-400/90 cursor-pointer dark:text-whiten text-boxdark rounded-sm">
                        <MdOutlineCheck className='flex justify-center items-center' />
                    </div>
                    <div className="p-1 cursor-pointer bg-red-400 dark:text-whiten text-boxdark rounded-sm">
                        <IoClose className='flex justify-center items-center ' />
                    </div>
                </div>
                : null }
        </div>

    );
}

const statusButton = (status: string) => {
    let textColor = '';
    switch (status) {
        case 'verified':
            textColor = 'text-green-500';
            break;
        case 'rejected':
            textColor = 'text-red-500';
            break;
        case 'pending':
        default:
            textColor = 'text-yellow-400';
    }

    return (
        <div className={ `${textColor} capitalize` }>
            { status }
        </div>
    );
};
const medicines = [
    {
        name: "Paracetamol",
        price: 5.99,
        category: "Analgesic",
        type: "Non-Prescription",
        status: "Verified",
        actions: "Edit | Delete",
    },
    {
        name: "Amoxicillin",
        price: 12.50,
        category: "Antibiotic",
        type: "Prescription",
        status: "Pending",
        actions: "Edit | Delete",
    },
    {
        name: "Metformin",
        price: 8.75,
        category: "Antidiabetic",
        type: "Prescription",
        status: "Verified",
        actions: "Edit | Delete",
    },
    {
        name: "Ibuprofen",
        price: 6.25,
        category: "Analgesic",
        type: "Non-Prescription",
        status: "Rejected",
        actions: "Edit | Delete",
    },
    {
        name: "Cetirizine",
        price: 4.99,
        category: "Antihistamine",
        type: "Non-Prescription",
        status: "Pending",
        actions: "Edit | Delete",
    },
    {
        name: "Insulin",
        price: 22.00,
        category: "Antidiabetic",
        type: "Prescription",
        status: "Verified",
        actions: "Edit | Delete",
    },
    {
        name: "Amlodipine",
        price: 10.99,
        category: "Antihypertensive",
        type: "Prescription",
        status: "Pending",
        actions: "Edit | Delete",
    },
    {
        name: "Omeprazole",
        price: 7.50,
        category: "Gastrointestinal",
        type: "Non-Prescription",
        status: "Verified",
        actions: "Edit | Delete",
    },
];



const rows = medicines.map((medicine) => {
    return createData(
        medicine.name,
        medicine.price.toString(),
        <ModalParent presc={ medicine.type } />,
        medicine.category,
        statusButton(medicine.status.toLowerCase()),
        actionButton(medicine.status.toLowerCase()),
    );
});



export default function OrdersTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={ { width: '100%', overflow: 'hidden' } }>
            <TableContainer className='dark:bg-boxdark dark:text-white/90' sx={ { maxHeight: 440 } }>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            { columns.map((column) => (
                                <TableCell className=''
                                    key={ column.id }
                                    align={ column.align }
                                    style={ { minWidth: column.minWidth } }
                                >
                                    <div className="font-semibold font-sans">

                                        { column.label }
                                    </div>
                                </TableCell>
                            )) }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={ -1 } key={ index }>
                                        { columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={ column.id } align={ column.align }>
                                                    <div className="text-black/65 font-light font-sans">
                                                        { column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value }
                                                    </div>
                                                </TableCell>
                                            );
                                        }) }
                                    </TableRow>
                                );
                            }) }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                className='dark:bg-boxdark dark:text-white/90'
                rowsPerPageOptions={ [5, 10, 25, 100] }
                component="div"
                count={ rows.length }
                rowsPerPage={ rowsPerPage }
                page={ page }
                onPageChange={ handleChangePage }
                onRowsPerPageChange={ handleChangeRowsPerPage }
            />
        </Paper>
    );
}
