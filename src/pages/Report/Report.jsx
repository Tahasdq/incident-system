import React, { useEffect, useState } from 'react'
import '../Report/Report.scss'
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { saveAs } from 'file-saver';
import { jwtDecode } from 'jwt-decode';

const Report = () => {
    const [result, setResult] = useState([]);
    const [filteredResult, setFilteredResult] = useState([]);
    const [start, setStart] = useState(dayjs('0-00-0T0:0'));
    const [end, setEnd] = useState(dayjs('0-00-0T0:0'));
    const [loading, setLoading] = useState(false);
    const [street, setStreet] = useState("")
    const [city, setCity] = useState("")

    const handleSearch = () => {
        const startingDate = new Date(start);
        const endingDate = new Date(end);
        const filteredResultfunction = filteredResult.filter((item) => {
            const registrationDate = new Date(item.registrationDate);
            const { Street, City } = item
            if (registrationDate >= startingDate && registrationDate <= endingDate) {
                return (item)
            }
            else if (Street === street || City === city) {
                return (item)
            }
        });
        setResult(filteredResultfunction);
    }

    useEffect(() => {
        setLoading(true);
        axios.get("https://incident-system.onrender.com/occurencewithstatusthree")
            .then((res) => {
                console.log(res.data);
                setResult(res.data);
                setFilteredResult(res.data)
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleStartingDateAndTime = (date) => {
        setStart(date);
    }

    const handleEndingDateAndTime = (date) => {
        if (date >= start) {
            setEnd(date);
        } else {
            setEnd(dayjs('0-00-0T0:0'));
            alert("Selecione uma data de término correta");
        }
    }

    const previewPdf = async (id) => {
        const token = localStorage.getItem("token");
        const ReportCreatedBy = jwtDecode(token).username;

        axios.get(`https://incident-system.onrender.com/create-pdf/new/${id}?ReportCreatedBy=${ReportCreatedBy}`, { responseType: 'text' })
            .then((response) => {
                const newWindow = window.open();
                newWindow.document.write(response.data);
                newWindow.document.close();
            })
            .catch((error) => {
                console.error('Error creating or downloading PDF:', error);
            });
    }

    const takeToPdfPage = async (id) => {
        const token = localStorage.getItem("token");
        const ReportCreatedBy = jwtDecode(token).username;
        
        try {
            const response = await axios.get(`https://incident-system.onrender.com/u/download-pdf/${id}`, {
                params: {
                    ReportCreatedBy: ReportCreatedBy
                }
            });

            axios({
                url: `https://incident-system.onrender.com/pdf/${id}`,
                method: 'GET',
                responseType: 'blob', // Important: Set the responseType to 'blob' to receive binary data
            })
                .then((response) => {
                    const blob = new Blob([response.data], { type: 'application/pdf' });
                    saveAs(blob, `pdf-${id}.pdf`); // Save the blob as a file
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

            return response.data;

        } catch (error) {
            console.error('Error creating downloadable PDF:', error);
            throw error;
        }
    };

    const handleDownloadButtonClick = (id) => {
        // createAndDownloadPdf(id);
        takeToPdfPage(id)
        // Disable further clicks by removing the event listener
        const downloadButton = document.getElementById(id);
        downloadButton.removeEventListener('click', handleClick);
    };

    const handleClick = (e) => {
        const id = e.currentTarget.id;
        handleDownloadButtonClick(id);
    };

    const createAndDownloadPdf = (id) => {
        // Decode the JWT token to get the username
        const token = localStorage.getItem("token");
        const ReportCreatedBy = jwtDecode(token).username;
        console.log(ReportCreatedBy)
        // Send ID and ReportCreatedBy to backend to generate PDF
        axios.post(`https://incident-system.onrender.com/create-pdf/${id}`, { ReportCreatedBy }, { responseType: 'blob' })
            .then((response) => {
                // Create a blob from the PDF data
                console.log(response.data)
                const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

                // Create a temporary URL for the blob
                const url = URL.createObjectURL(pdfBlob);

                // Create an anchor element to trigger the download
                const link = document.createElement('a');
                link.href = url;
                link.download = 'newPdf.pdf';
                document.body.appendChild(link);

                // Trigger the download
                link.click();

                // Cleanup
                URL.revokeObjectURL(url);
                document.body.removeChild(link);
            })
            .catch((error) => {
                console.error('Error creating or downloading PDF:', error);
            });
    };

    return (
        <div className="custom-container">
            <div className="container full_hieght_3">
                <div className="Dashboard_heading">
                    <h3>Relatório</h3>
                    <hr className='' />
                </div>
                <div className="row report-reponsive-ipad ">
                    <div className="col-md-8 col-sm-12 col-lg-12 w-100 d-flex" style={{ marginTop: "13px" }}>
                        <div className="Searchbar">
                            <div className="dateandtime">
                                <div className="starting-date-time">
                                    <label htmlFor=""><strong>A partir da</strong></label>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                                        <DateTimePicker
                                            className="dateandtime"
                                            value={start}
                                            onChange={handleStartingDateAndTime}
                                            sx={{ backgroundColor: " rgb(255, 255, 255)" }}
                                        />
                                    </LocalizationProvider>
                                </div>
                                <div className="ending-date-time">
                                    <label htmlFor=""><strong>Para</strong></label>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                                        <DateTimePicker
                                            className="dateandtime"
                                            value={end}
                                            onChange={handleEndingDateAndTime}
                                            sx={{ backgroundColor: " rgb(255, 255, 255)" }}
                                        />
                                    </LocalizationProvider>
                                </div>
                            </div>
                            <div className="street-and-city">
                                <div>
                                    <label htmlFor=""><strong>Rua</strong></label>
                                    <TextField id="outlined-basic" label="Rua"
                                        value={street}
                                        className="dateandtime"
                                        onChange={(e) => setStreet(e.target.value)}
                                        variant="outlined" sx={{ backgroundColor: " rgb(255, 255, 255)" }} />
                                </div>
                                <div>
                                    <label htmlFor=""><strong>Cidade</strong></label>
                                    <TextField id="outlined-basic" label="Cidade"
                                        className="dateandtime"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        variant="outlined" sx={{ backgroundColor: " rgb(255, 255, 255)" }} />
                                </div>
                                <input className="search-btn btn btn-primary text-center w-30" value="Busca" type="submit" onClick={handleSearch} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <h5>O resultado é:</h5>
                    {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <CircularProgress size={100} />
                    </Box> :
                        <div className="result overflow">
                            <div className="result-content-wrapper">
                                {result.length > 0 ? result.map((v, i) => {
                                    const parsedDate = dayjs(v.registrationDate);
                                    const formattedDateRegistratonDate = parsedDate.format('DD/MM/YY');
                                    return (
                                        <div className="result-content" key={i}>
                                            <div>
                                                <table className="table">
                                                    <thead>
                                                        <tr className="standout-row">
                                                            <th><strong>Data</strong></th>
                                                            <th><strong>Occurencia</strong></th>
                                                            <th><strong>Cod</strong></th>
                                                            <th><strong>Rua</strong></th>
                                                            <th><strong>Bairro</strong></th>
                                                            <th><strong>Download</strong></th>
                                                            <th><strong>Preview</strong></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>{formattedDateRegistratonDate}</td>
                                                            <td>{v.occurance_Number}</td>
                                                            <td>{v.occurance_Code}</td>
                                                            <td className='street'>{v.Street}</td>
                                                            <td lassName='city'>{v.City}</td>
                                                            {/* Maaz Update: I have changed the functionality of report being download*/}
                                                            <td>
                                                                <div id={v._id} onClick={() => {createAndDownloadPdf(v._id)}}>
                                                                    <FileDownloadIcon
                                                                        sx={{
                                                                            cursor: "pointer"
                                                                        }}
                                                                    />
                                                                </div>
                                                            </td>
                                                            {/* Maaz Update: I have added this for to show complete preview details */} 
                                                            <td style={{ fontWeight: '600', cursor: 'pointer' }} onClick={() => {previewPdf(v._id)}}>Preview</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>
                                    )
                                }) : <div className="no-result-content text-center my-3">
                                    <p><strong>
                                        Resultados não encontrados
                                    </strong>
                                    </p>
                                </div>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Report;
