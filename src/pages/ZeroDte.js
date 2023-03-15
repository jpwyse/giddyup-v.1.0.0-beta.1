import React, { useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import api from '../axios/api';
import Loading from '../pages/Loading';
import ZeroDteNav from '../components/ZeroDte/ZeroDteNav';
import ZeroDteChart from '../components/ZeroDte/ZeroDteChart';
import '@fontsource/vt323';
import '@fontsource/aldrich';


const chartConfigOptions = [
    {
      id: 0,
      title: 'TOTAL PERCENT GAMMA EXPOSURE',
      data1: 'totalGamma%',
      data2: null,
      label1: 'TOTAL GAMMA EXPOSURE per 1% MOVE in SPOT by STRIKE',
      label2: null,
      domain: '100000000',
      ml: 45,
    },
    {
      id: 1,
      title: 'TOTAL DOLLAR GAMMA EXPOSURE',
      data1: 'totalGamma$',
      data2: null,
      label1: 'TOTAL GAMMA EXPOSURE per $1 MOVE in SPOT by STRIKE',
      label2: null,
      domain: '10000000',
      ml: 45,
    },
    {
      id: 2,
      title: 'CALL/PUT PERCENT GAMMA EXPOSURE',
      data1: 'callGamma%',
      data2: 'putGamma%',
      label1: 'CALL GAMMA per 1% MOVE in SPOT by STRIKE',
      label2: 'PUT GAMMA per 1% MOVE in SPOT by STRIKE',
      domain: '100000000',
      ml: 45,
    },
    {
      id: 3,
      title: 'CALL/PUT DOLLAR GAMMA EXPOSURE',
      data1: 'callGamma$',
      data2: 'putGamma$',
      label1: 'CALL GAMMA per $1 MOVE in SPOT by STRIKE',
      label2: 'PUT GAMMA per $1 MOVE in SPOT by STRIKE',
      domain: '10000000',
      ml: 45,
    },
    {
      id: 4,
      title: 'CALL/PUT VOLUME',
      data1: 'callVolume',
      data2: 'putVolume',
      label1: 'CALL VOLUME',
      label2: 'PUT VOLUME',
      domain: '10000',
      ml: 10,
    },
    {
      id: 5,
      title: 'CALL/PUT OPEN INTEREST',
      data1: 'callOpeninterest',
      data2: 'putOpeninterest',
      label1: 'CALL OPEN INTEREST',
      label2: 'PUT OPEN INTEREST',
      domain: '1000',
      ml: 0,
    },
    {
      id: 6,
      title: 'CALL/PUT OPEN INTEREST RATIO',
      data1: 'callVolumeopeninterestratio',
      data2: 'putVolumeopeninterestratio',
      label1: 'CALL OPEN INTEREST RATIO',
      label2: 'PUT OPEN INTEREST RATIO',
      domain: '10',
      ml: 0,
    },
    {
      id: 7,
      title: 'CALL/PUT VOLATILITY',
      data1: 'callVolatility',
      data2: 'putVolatility',
      label1: 'CALL VOLATILITY',
      label2: 'PUT VOLATILITY',
      domain: '100',
      ml: 0,
    },
    {
      id: 8,
      title: 'CALL/PUT DELTA',
      data1: 'callDelta',
      data2: 'putDelta',
      label1: 'CALL DELTA',
      label2: 'PUT DELTA',
      domain: '1',
      ml: 0,
    },
    {
      id: 9,
      title: 'CALL/PUT GAMMA',
      data1: 'callGamma',
      data2: 'putGamma',
      label1: 'CALL GAMMA',
      label2: 'PUT GAMMA',
      domain: '0.1',
      ml: 0,
    },
    {
      id: 10,
      title: 'CALL/PUT VEGA',
      data1: 'callVega',
      data2: 'putVega',
      label1: 'CALL VEGA',
      label2: 'PUT VEGA',
      domain: '0.01',
      ml: 0,
    },
    {
      id: 11,
      title: 'CALL/PUT THETA',
      data1: 'callTheta',
      data2: 'putTheta',
      label1: 'CALL THETA',
      label2: 'PUT THETA',
      domain: '0.1',
      ml: 0,
    },
  ];



const ZeroDte = () => {
  const isAuth = useSelector(state => state.auth.isAuth);
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [marketDate, setMarketDate] = useState(null);
  const [spotPrice, setSpotPrice] = useState(null);
  const [period, setPeriod] = useState(null);
  const [ticker, setTicker] = useState('SPY');
  const [chartIndex, setChartIndex] = useState(0);
  const [activeChart, setActiveChart] = useState(null);
  const [contracts, setContracts] = useState(['calls', 'puts']);
  const [dataError, setDataError] = useState(false);
  const [dataAlert, setDataAlert] = useState(false);
  const [marketClosed, setMarketClosed] = useState(false);
  const dataAlertDone = useRef(false);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`api/zero_dte/get/${ticker}`);
        //console.log(response.data);
        if (!response.data){
          setLoading(false);
          setMarketClosed(true);
        } else {
          setData(Object.values(response.data.data));
          setMarketDate(response.data.date);
          setSpotPrice(response.data.spot_price);
          setPeriod(response.data.period);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }
        if (!user && !dataAlertDone.current) {
          setDataAlert(true);
        }
      } catch (error) {
        console.log('error', error.response);
        setDataError(true);
        setLoading(false);
      }
    };
    setLoading(true);
    setTimeout(() => {
      if (!dataError) {
        fetchData();
      } else {
        setLoading(false);
      }
    }, 1000);
  }, [ticker, dataError]);


  useEffect(() => {
  	setActiveChart(chartConfigOptions.at(chartIndex));
  }, [chartIndex]);


  const handleDataAlert = () => {
    setDataAlert(false);
    dataAlertDone.current = true;
  };


  const dataNotice = (
    <Dialog open={dataAlert} onClose={handleDataAlert}>
      <DialogTitle sx={{ bgcolor: '#2D3436' }}>{dataMsg}</DialogTitle>
      <DialogActions sx={{ bgcolor: '#2D3436' }}>
        <Button 
          variant="contained" 
          onClick={() => navigate("/login")}
          sx={{  
            font: '20px Aldrich',
            fontWeight: 'bold',
            color: '#A8E4A0',
            textShadow: '2px 3px 4px rgba(0,0,0,0.3)',
            height: '40px',
            background: 'none',
            border: '3px solid #A8E4A0',
            boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
            mr: 1.5,
            pt: 1,
            '&:hover': { 
              fontWeight: 'bold',
              color: '#D0F0C0', 
              background: 'none',
              border: '3px solid #D0F0C0',
              transform: 'scale(1.05)',
              boxShadow: 'rgba(208, 240, 192, 0.19) 0px 10px 20px, rgba(208, 240, 192, 0.23) 0px 6px 6px;',
            }
          }}
        >
          Login
        </Button>
        <Button 
          variant="contained" 
          onClick={() => navigate("/signup")}
          sx={{  
            font: '20px Aldrich',
            fontWeight: 'bold',
            color: '#8884D8',
            textShadow: '2px 3px 4px rgba(0,0,0,0.3)',
            height: '40px',
            background: 'none',
            border: '3px solid #8884D8',
            boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
            mr: 1.5,
            pt: 1,
            '&:hover': { 
              fontWeight: 'bold',
              color: '#D0F0C0', 
              background: 'none',
              border: '3px solid #D0F0C0',
              transform: 'scale(1.05)',
              boxShadow: 'rgba(208, 240, 192, 0.19) 0px 10px 20px, rgba(208, 240, 192, 0.23) 0px 6px 6px;',
            }
          }}
        >
          SignUp
        </Button>
        <Button 
          variant="contained" 
          onClick={handleDataAlert} 
          sx={{  
            font: '20px Aldrich',
            fontWeight: 'bold',
            color: '#d3d3d3',
            textShadow: '2px 3px 4px rgba(0,0,0,0.3)',
            height: '40px',
            background: 'none',
            border: '3px solid #d3d3d3',
            boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
            mr: 1.5,
            pt: 1,
            '&:hover': { 
              fontWeight: 'bold',
              color: '#F8F8FF', 
              background: 'none',
              border: '3px solid #F8F8FF',
              transform: 'scale(1.05)',
              boxShadow: 'none',
            }
          }}
        >
          Maybe Later
        </Button>
      </DialogActions>
    </Dialog>
  );


  const renderPage = () => {
    if (loading && !dataError) {
      return (
        <React.Fragment>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Loading />
            </Grid>
          </Grid>
        </React.Fragment>
      );
    } else if (dataError) {
      return (
        <React.Fragment>
          <Stack direction="column" alignItems="center" justifyContent="center">
            <Typography align="center" sx={{ font: '108px Aldrich', fontWeight: 'bold', color: '#8884D8', textShadow: '2px 4px 4px rgba(245,245,245,0.5)', mt: 15, width: '75%' }}>
              Error retrieving 0DTE data.
            </Typography>
            <Button
              type="submit"
              variant="contained"
              size="small"
              onClick={() => setDataError(false)}
              sx={{  
                font: '44px Aldrich',
                fontWeight: 'bold',
                color: '#8884D8',
                textShadow: '2px 3px 4px rgba(0,0,0,0.3)',
                height: '60px',
                background: 'none',
                border: '4px solid #8884D8',
                boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
                m: "auto",
                mt: 5,
                pt: 1,
                '&:hover': { 
                  fontWeight: 'bold',
                  color: '#D0F0C0', 
                  background: 'none',
                  border: '3px solid #D0F0C0',
                  transform: 'scale(1.05)',
                  boxShadow: 'rgba(208, 240, 192, 0.19) 0px 10px 20px, rgba(208, 240, 192, 0.23) 0px 6px 6px;',
                }
              }}
            >
              Try Again
            </Button>
          </Stack>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Grid container spacing={4}>
            {dataNotice}
            <Grid item xs={12}>
              <ZeroDteNav 
                chartConfigOptions={chartConfigOptions} 
                ticker={ticker} 
                setTicker={setTicker} 
                marketDate={marketDate}
                period={period}
                activeChart={activeChart}
                chartIndex={chartIndex}
                setChartIndex={setChartIndex} 
                contracts={contracts} 
                setContracts={setContracts} 
              />
            </Grid>
            <Grid item xs={12}>
              { !marketClosed ?
                <Box sx={{ height: '80vh' }}>
                  <ZeroDteChart 
                    data={data}
                    spotPrice={spotPrice}
                    activeChart={activeChart} 
                    contracts={contracts} 
                  />
                </Box>
              : 
                <Stack direction="column" alignItems="center" justifyContent="center">
                  <Typography align="center" sx={{ font: '108px Aldrich', fontWeight: 'bold', color: '#8884D8', textShadow: '2px 4px 4px rgba(245,245,245,0.5)', mt: 15, width: '75%' }}>
                    U.S. financial markets are currently closed. Go touch some grass.
                  </Typography>
                </Stack>
              }
            </Grid>
          </Grid>
        </React.Fragment>
      );
    }
  };


	return (
		renderPage()
	);
};


export default ZeroDte;


const dataMsg = (
  <React.Fragment>
    <Typography sx={{ font: '26px Aldrich', fontWeight: 'bold', color: '#8884D8', lineHeight: 1.25, mb: 2 }}>
      ALERT:
    </Typography>
    <Typography sx={{ font: '26px Aldrich', fontWeight: 'bold', color: '#F8F8FF', lineHeight: 1.25, mb: 2 }}>
      Data currently being displayed is an <u>hour behind</u> live market data.
    </Typography>
    <Typography sx={{ font: '26px Aldrich', fontWeight: 'bold', color: '#F8F8FF', lineHeight: 1.25 }}>
      To view live market data please login or sign-up.
    </Typography>
  </React.Fragment>
);

