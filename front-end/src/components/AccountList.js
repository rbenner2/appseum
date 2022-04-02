import "./Index.css";
import React from "react";
import Footer from "./Footer";
import { Button, Card, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import LoggedInNavBar from "./LoggedInNavBar";
import LoggedInNavBarAdmin from "./LoggedInNavBar_Admin";
import axios from "axios";
import { useEffect } from "react";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { useState } from "react";
import { Grid } from "@mui/material";
import docCookies from 'doc-cookies';
import ConfirmDialog from "./ConfirmDialog";
import Pagination from './Pagination';

const baseURL = "http://localhost:4000/api/users/";

function AccountList() {

  const [isAdminValue,setIsAdmin]= useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rowID, setrowID] = useState("");
  // add pagination
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  useEffect(() => {
    var _isAdmin = docCookies.getItem('isAdmin');
    setIsAdmin(_isAdmin);
    var _token = docCookies.getItem('token');
    setLoading(true);
    getPost(_token);
  }, []);

  function getPost(_token) {
    axios.post(baseURL, {
        company: docCookies.getItem("company")
        // ,
        // headers: {
        //   Authorization: `Bearer ${_token}`
        // }
      })
      .then((res) => {
        //setData(res.data);
        setPosts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }

  function openState(rowID) {
    setConfirmOpen(true);
    setrowID(rowID);
  }

  function handleRemove(_id) {
    axios
      .delete(`${baseURL}/deleteById/${_id}`)
      .then((res) => {
        console.log("Item successfully deleted!");
       
        window.location.reload();
      })
      .catch((error) => {
        console.log(`${process.env.PORT}`);
        console.log(error);
      });
  }

  if (loading) {
    return <h2>Loading...</h2>;
  }
  return (
    <>
      <div className="MainContainer">
        {isAdminValue ? (
          <LoggedInNavBarAdmin></LoggedInNavBarAdmin>
        ) : (
          <LoggedInNavBar></LoggedInNavBar>
        )}
        <main>
          <section>
            <Grid
              container
              spacing={10}
              alignItems="center"
              justifyContent="center"
            >
              {currentPosts.map((row) => (
                <Grid item md={5}>
                  <p key={row._id}>
                    {/* This line works ?? Not sure. Needs to be tested on a lot of cases. Add lots of items.  */}
                    {
                      <Card sx={{ maxWidth: 600 }}>
                        <CardMedia
                          component="img"
                          height="240"
                          image={row.image}
                          alt="personal avatar"
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {row.username}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            email: {row.email}
                            <br />
                            isAdmin: {row.isAdmin ? "true" : "false"}
                            <br />
                            company: {row.company}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small">
                            <Link
                              to={{
                                pathname: "/EditProfile",
                                state: { id: row._id },
                              }}
                              style={{ textDecoration: "none" }}
                            >
                              Edit
                            </Link>
                          </Button>

                          <Button
                            size="small"
                            onClick={() => openState(row._id)}
                          >
                            Delete
                          </Button>
                          <ConfirmDialog
                            title="Delete Post?"
                            open={confirmOpen}
                            setOpen={setConfirmOpen}
                            onConfirm={() => handleRemove(rowID)}
                          >
                            Are you sure you want to delete this item?
                          </ConfirmDialog>
                        </CardActions>
                      </Card>
                    }
                  </p>
                </Grid>
              ))}
            </Grid>
            <Pagination
            postsPerPage={postsPerPage}
            totalPosts={posts.length}
            paginate={paginate}
            />
          </section>
        </main>
      </div>
      <Footer></Footer>
    </>
  );

}
export default AccountList;
