import React, { useEffect, useState } from "react";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CoffeeIcon from '@mui/icons-material/Coffee';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";
import { Link, useNavigate } from 'react-router-dom';



const defaultTheme = createTheme();

export default function Album() {
  const navigate = useNavigate();

  const [account, setAccount] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [promotions, setPromotions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get("https://strange-cow-getup.cyclic.app/entrepreneur", {
        headers,
      });
      setAccount(response.data[0]);

      const response2 = await axios.get("https://strange-cow-getup.cyclic.app/promotion", {
        headers,
      });
      setPromotions(response2.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      // Token is not available, redirect to the Login page
      navigate('/Login');
    }
    fetchData();
  }, [navigate]);

  function handleMapClick() {
    console.log("แผนที่ถูกคลิก");
  }

  function handleEditClick() {
    setIsEditing(true);
    setEditedData({ ...account, password: "" });
  }

  function handleSaveClick() {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    if (editedData.password === "") {
      editedData.password = account.password;
    }
    axios
      .put("https://strange-cow-getup.cyclic.app/EditEntrepreneur", editedData, { headers })
      .then((response) => {
        if (response.status === 200) {
          console.log("ข้อมูลถูกอัปเดตเรียบร้อย");
          setIsEditing(false);
          fetchData();
        } else if (response.status === 404) {
          console.error("ไม่พบผู้ประกอบการ");
        }
      })
      .catch((error) => {
        console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล:", error);
      });
  }

  async function uploadFile() {
    try {
      if (!selectedFile) {
        Swal.fire({
          title: "โปรดเลือกไฟล์รูปก่อน",
          icon: "warning",
        });
        return;
      }

      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axios.post(
        "https://strange-cow-getup.cyclic.app/upload",
        formData,
        {
          headers,
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "อัปโหลดสำเร็จ",
          text: "ไฟล์รูปถูกอัปโหลดเรียบร้อย",
          icon: "success",
        });
        // อัปโหลดเสร็จแล้ว ทำการเรียก fetchData() เพื่อรีเฟรชข้อมูล
        fetchData();
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: "เกิดข้อผิดพลาดในการอัปโหลดไฟล์",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: `เกิดข้อผิดพลาดในการอัปโหลดไฟล์: ${error.message}`,
        icon: "error",
      });
    }
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    setSelectedFile(file);
  }

  // Function to delete a promotion by pro_id
  function handleDeletePromotion(pro_id) {
    Swal.fire({
      title: "ยืนยันการลบ?",
      text: "คุณแน่ใจหรือไม่ที่ต้องการลบโปรโมชั่นนี้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบ!",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://strange-cow-getup.cyclic.app/promotion/${pro_id}`)
          .then((response) => {
            if (response.status === 200) {
              Swal.fire({
                title: "ลบสำเร็จ!",
                text: "โปรโมชั่นถูกลบเรียบร้อย",
                icon: "success",
              });
              fetchData();
            } else if (response.status === 404) {
              Swal.fire({
                title: "ไม่พบโปรโมชั่น",
                text: "ไม่สามารถลบโปรโมชั่นได้",
                icon: "error",
              });
            }
          })
          .catch((error) => {
            Swal.fire({
              title: "เกิดข้อผิดพลาด",
              text: `เกิดข้อผิดพลาดในการลบโปรโมชั่น: ${error.message}`,
              icon: "error",
            });
          });
      }
    });
  }

  function handleLogout() {
    // Clear the token from Local Storage
    localStorage.removeItem("token");

    // Redirect to the root URL
    window.location.href = '/';
  }




  return (

    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBar position="relative" style={{ backgroundColor: 'rgb(139, 69, 19)' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>          
          <Typography variant="h6" color="inherit" noWrap>
          <CoffeeIcon sx={{ mr: 1 }} />
            ข้อมูลส่วนตัว
          </Typography></div>
        <div>         
          <Link to='/'>
            <Button color="inherit" style={{ color: 'white' }}>
              Home
            </Button>
            </Link>
            <Button color="inherit" onClick={() => handleLogout()}>
              Logout
            </Button>
            </div>
        </Toolbar>
      </AppBar>
      
      <main>
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 2,
          }}
        >
          <Grid container spacing={2}>
            <Container maxWidth="md">
              <Card>
                <CardContent style={{ textAlign: "left" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        component="h1"
                        variant="h5"
                        color="text.primary"
                        gutterBottom
                      >
                        Shop Name
                      </Typography>
                      {isEditing ? (
                        <TextField
                          label="Shop Name"
                          variant="outlined"
                          value={editedData.shopname}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              shopname: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <Typography
                          component="h1"
                          variant="h5"
                          color="text.secondary"
                        >
                          {account.shopname}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography
                        component="h1"
                        variant="h5"
                        color="text.primary"
                        gutterBottom
                      >
                        Province
                      </Typography>
                      {isEditing ? (
                        <TextField
                          label="Province"
                          variant="outlined"
                          value={editedData.province}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              province: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <Typography
                          component="h1"
                          variant="h5"
                          color="text.secondary"
                        >
                          {account.province}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography
                        component="h1"
                        variant="h5"
                        color="text.primary"
                        gutterBottom
                      >
                        Detail
                      </Typography>
                      {isEditing ? (
                        <TextField
                          label="Detail"
                          variant="outlined"
                          value={editedData.detail}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              detail: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <Typography
                          component="h1"
                          variant="h5"
                          color="text.secondary"
                        >
                          {account.detail}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography
                        component="h1"
                        variant="h5"
                        color="text.primary"
                        gutterBottom
                      >
                        Usersname
                      </Typography>
                      {isEditing ? (
                        <TextField
                          label="Usersname"
                          variant="outlined"
                          value={editedData.usersname}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              usersname: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <Typography
                          component="h1"
                          variant="h5"
                          color="text.secondary"
                        >
                          {account.usersname}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography
                        component="h1"
                        variant="h5"
                        color="text.primary"
                        gutterBottom
                      >
                        location
                      </Typography>
                      {isEditing ? (
                        <TextField
                          label="location"
                          variant="outlined"
                          value={editedData.location}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              location: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <Typography
                          component="h1"
                          variant="h5"
                          color="text.secondary"
                        >
                          {account.location}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      {isEditing ? (
                        <div>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleSaveClick}
                          >
                            บันทึก
                          </Button>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => setIsEditing(false)}
                          >
                            ยกเลิก
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={handleEditClick}
                        >
                          แก้ไข
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Container>

            <Container maxWidth="md">
              <Grid item xs={12}>
                <input type="file" accept="image/*" enctype="multipart/form-data" onChange={handleFileChange} />
                <button onClick={uploadFile}>อัปโหลด</button>
              </Grid></Container>

            {promotions.map((promotion) => (
              <Container maxWidth="md"><Grid item xs={12} key={promotion.pro_id}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {promotion.pro_id}
                    </Typography>
                    <Typography color="text.secondary">
                      {promotion.createAt}
                    </Typography>
                    {promotion.img && (
                      <img
                        src={`data:image/jpeg;base64,${promotion.img}`}
                        alt="รูปภาพโปรโมชั่น"
                        width="200"
                      />
                    )}
                    <div>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleDeletePromotion(promotion.pro_id)}
                      >
                        ลบ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Grid></Container>
            ))}
          </Grid>
        </Box>
      </main>
    </ThemeProvider>
  );
}
