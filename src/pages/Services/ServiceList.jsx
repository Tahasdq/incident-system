import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';



const ServiceList = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    setLoading(true);
    axios
      .get("https://incident-system.onrender.com/getnewoccuranceAll")
      .then((response) => {
        // Set the fetched data in state
        setData(response.data);
        // console.log(response.data)
        // console.log(data)
      })
      .catch((error) => {
        // Handle errors, if any
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false)
      })


  }, [])



  return (
    <div>
      <div className="container full_hieght">

        {/* <div className=" row Dashboard_heading">
        <h3>Service</h3>
      </div> */}

        {
          loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <CircularProgress size={100} />
          </Box> :

            data.map((v, i) => {
              const id = v._id;
              console.log(id)
              return (
                <Link to={`/service/listchild/${id}`} >
                  <div className="col-md-12 col-sm-12">

                    <div className="list mt-2 p-4 ">

                      <h6>Telephono: {v.phone} </h6>
                      <h6>Solicitante: {v.Applicant} </h6>
                      <h6>Rua: {v.Street}</h6>
                      <h6>Cód. Atendimento: {v.occurance_Code}</h6>
                      {/* <h4>Occurance Code : {v.occurance_Code}</h4> */}
                    </div>
                  </div>
                </Link>
              )

            })}


        {/* <Outlet/> */}

      </div>
    </div>
  )
}

export default ServiceList  