import React, { useEffect, useState } from "react";
import axios from "axios";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import "./customer.css"

function Customer() {
  // const [options, setOptions] = useState([]);
  const [error, setError] = useState(false);
  const [value, setText] = useState("");

  const errorMessage = "User ID has to be a number";

  useEffect(() => {
    fetchOptions()
  }, [])

  useEffect(() => {
    if(value.length !== 0) {
      setError(isNaN(parseInt(value, 10)))
    } else {
      setError(false)
    }
  }, [value])

  //build the options array for the autocomplete component
  const fetchOptions = async () => {
    await axios.get("http://127.0.0.1:8080/getChannels")
      .then((res) => {
        const buildOptions = []
        res.data.channels.forEach((ch) => {
          buildOptions.push({label: String(ch.id)})
        })
        buildOptions.push({label: "Create new user"})
        // setOptions(buildOptions)
      })
  }

  return (
    <div className="customer">
      <div>
        <TextField
          id="filled-basic"
          label="User ID"
          variant="filled"
          value={value}
          onChange={(e) => setText(e.target.value)}
          error={error}
          helperText={error && errorMessage}
        />
      </div>
      <div>
        <Button
          variant="contained"
          sx={{marginTop: "0.50em"}}
        >
          <Link
            reloadDocument
            style={{textDecoration: "none", color: "white"}}
            to={`/customer/${value}`} >submit
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default Customer