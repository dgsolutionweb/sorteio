import { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline,
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Grid,
  Avatar,
  Divider,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tooltip,
  IconButton,
  Alert
} from '@mui/material';
import { 
  CardGiftcard, 
  Celebration, 
  EmojiEvents,
  Favorite,
  Timer,
  Refresh,
  CameraAlt,
  Verified,
  Camera,
  PhotoCamera,
  FavoriteBorder,
  Instagram,
  AccountCircle,
  Check,
  Close,
  StarBorder,
  Star,
  ThumbUp,
  People,
  ArrowForward,
  Info
} from '@mui/icons-material';

// Importação dinâmica do confetti para evitar problemas de SSR
const Confetti = dynamic(() => import('react-confetti'), {
  ssr: false,
});

// Criando um tema personalizado com as cores do Dia das Mães
const theme = createTheme({
  palette: {
    primary: {
      main: '#ff7bbf',
      dark: '#c13d90',
      light: '#ffa6d5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#a05eb5',
      dark: '#753b92',
      light: '#c490da',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffe6f2',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1.2rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: '12px 24px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          padding: '8px 4px',
          height: 'auto',
        },
      },
    },
  },
});

export default function Home() {
  const participantes = [
    'marcela_schentl',
    'sol_almeida0303',
    'espetinho_do_centro',
    'cah.lombardi',
    'patricia8445',
    'veraschentl',
    'marcela_cristinasch',
    'marcela_cristina_shentl',
    'm.simonelemos',
    'anacarla_pimentel',
    'rosangelaeliandrade',
    'karlotam',
    'ocleusamariade',
    'paula_arluana',
    'bri_marinzeck',
    'laynennega',
    '_luciana.cristaldo',
    'marcelacmdias',
    'patriciafernandesteofilo',
    'mattosgabrieli',
    'vaniavieira5311'
  ];

  const [sorteando, setSorteando] = useState(false);
  const [ganhador, setGanhador] = useState(null);
  const [participanteAtual, setParticipanteAtual] = useState('');
  const [confetti, setConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  // Estados para validação do ganhador
  const [validacaoAberta, setValidacaoAberta] = useState(false);
  const [segueLoja, setSegueLoja] = useState(false);
  const [curtiuPost, setCurtiuPost] = useState(false);
  const [marcouAmigos, setMarcouAmigos] = useState(false);
  const [validacaoConcluida, setValidacaoConcluida] = useState(false);
  const [ganhadorValidado, setGanhadorValidado] = useState(false);
  const [tentativaValidacao, setTentativaValidacao] = useState(0);
  const [tempoSorteio, setTempoSorteio] = useState(7); // Tempo em segundos
  const [percentualConcluido, setPercentualConcluido] = useState(0);
  
  // Informações da loja para exibição
  const lojaInfo = {
    nome: '@allimport_guaira',
    instagram: 'https://www.instagram.com/allimport_guaira',
    regras: [
      'Seguir a loja @allimport_guaira',
      'Curtir o post do sorteio',
      'Marcar pelo menos 3 amigos nos comentários'
    ]
  };

  useEffect(() => {
    // Atualiza o tamanho da janela para o confetti
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Resetar a validação sempre que um novo ganhador for sorteado
  useEffect(() => {
    if (ganhador) {
      setSegueLoja(false);
      setCurtiuPost(false);
      setMarcouAmigos(false);
      setValidacaoConcluida(false);
      setGanhadorValidado(false);
    }
  }, [ganhador]);

  const iniciarSorteio = () => {
    if (sorteando) return;
    
    setSorteando(true);
    setGanhador(null);
    setConfetti(false);
    setPercentualConcluido(0);
    
    // Calcular total de iterações e intervalo para preencher os 7 segundos
    const totalMillis = tempoSorteio * 1000; // 7 segundos em milissegundos
    const intervalo = 100; // Intervalo entre iterações (ms)
    const totalIteracoes = Math.floor(totalMillis / intervalo);
    
    let contador = 0;
    
    const timer = setInterval(() => {
      // Seleciona um participante aleatório para mostrar durante a animação
      const indiceAleatorio = Math.floor(Math.random() * participantes.length);
      setParticipanteAtual(participantes[indiceAleatorio]);
      
      contador++;
      
      // Atualiza o percentual concluído para o progress bar
      const percentual = Math.min(100, Math.floor((contador / totalIteracoes) * 100));
      setPercentualConcluido(percentual);
      
      // Quando a animação terminar, escolhe o ganhador
      if (contador >= totalIteracoes) {
        clearInterval(timer);
        
        // Sorteia o ganhador final
        const indiceGanhador = Math.floor(Math.random() * participantes.length);
        const ganhadorFinal = participantes[indiceGanhador];
        
        setParticipanteAtual('');
        setGanhador(ganhadorFinal);
        setSorteando(false);
        setConfetti(true);
      }
    }, intervalo);
  };
  
  // Abre o modal de validação
  const abrirValidacao = () => {
    setValidacaoAberta(true);
  };
  
  // Fecha o modal de validação
  const fecharValidacao = () => {
    setValidacaoAberta(false);
  };
  
  // Tenta validar o ganhador com as regras definidas
  const validarGanhador = () => {
    setTentativaValidacao(tentativaValidacao + 1);
    
    // Verifica se todas as condições foram atendidas
    const estaValidado = segueLoja && curtiuPost && marcouAmigos;
    setGanhadorValidado(estaValidado);
    setValidacaoConcluida(true);
    
    // Se o ganhador não for válido, mantém o modal aberto
    if (!estaValidado) {
      return;
    }
    
    // Se o ganhador for válido, fecha o modal após um curto delay
    setTimeout(() => {
      setValidacaoAberta(false);
    }, 1500);
  };
  
  // Sorteia novamente se o ganhador anterior não atendeu aos requisitos
  const sortearNovamente = () => {
    setValidacaoConcluida(false);
    setGanhadorValidado(false);
    setGanhador(null);
    setValidacaoAberta(false);
    iniciarSorteio();
  };

  // Gera um gradiente aleatório para os avatares (estilo Instagram)
  const getRandomGradient = () => {
    const gradients = [
      'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', // Instagram
      'linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)', // Instagram 2
      'linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)', // Instagram 3
      'linear-gradient(45deg, #ff6a00, #ee0979)', // Vermelho/Laranja
      'linear-gradient(45deg, #00c6ff, #0072ff)', // Azul
      'linear-gradient(45deg, #ff9966, #ff5e62)', // Coral
      'linear-gradient(45deg, #7f00ff, #e100ff)', // Roxo
      'linear-gradient(45deg, #42e695, #3bb2b8)', // Verde-Água
      'linear-gradient(45deg, #ff5f6d, #ffc371)', // Rosa/Laranja
      'linear-gradient(45deg, #11998e, #38ef7d)', // Verde
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  // Gera as iniciais para o avatar
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(/[._]/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Determina um ícone para cada participante baseado no nome
  const getParticipantIcon = (name) => {
    const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const icons = [
      <CameraAlt />, 
      <FavoriteBorder />, 
      <PhotoCamera />, 
      <Verified />, 
      <Instagram />,
      <AccountCircle />
    ];
    return icons[nameHash % icons.length];
  };

  // Verifica se o nome começa com certas letras para classificação
  const hasVerifiedBadge = (name) => {
    // Simulando verificação: apenas alguns participantes terão o selo
    const verifiedNames = ['m.simonelemos', 'marcela_schentl', 'veraschentl', 'laynennega'];
    return verifiedNames.includes(name);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>Sorteio Dia das Mães - Smartwatch</title>
        <meta name="description" content="Sorteio especial de Dia das Mães - Concorra a um Smartwatch!" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" />
      </Head>

      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #ff7bbf 0%, #a05eb5 100%)',
          pt: 4,
          pb: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Modal de Validação do Ganhador */}
        <Dialog 
          open={validacaoAberta} 
          onClose={fecharValidacao}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: 'linear-gradient(to right, #c13d90, #753b92)',
            color: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Instagram /> Verificação de Requisitos
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pt: 2, mt: 2 }}>
            {validacaoConcluida && !ganhadorValidado && tentativaValidacao > 0 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                O participante não cumpriu todos os requisitos.
              </Alert>
            )}
            
            {validacaoConcluida && ganhadorValidado && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Todos os requisitos foram cumpridos! O ganhador está confirmado.
              </Alert>
            )}
            
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountCircle /> Participante: {ganhador}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Para ganhar o prêmio, o participante deve atender a todos os requisitos abaixo:
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={segueLoja} 
                      onChange={(e) => setSegueLoja(e.target.checked)} 
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1">
                        Segue a loja {lojaInfo.nome}
                      </Typography>
                      <Tooltip title="Verifique na página do Instagram se o participante segue a loja">
                        <IconButton size="small" sx={{ ml: 1 }}>
                          <Info fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={curtiuPost} 
                      onChange={(e) => setCurtiuPost(e.target.checked)} 
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1">
                        Curtiu o post do sorteio
                      </Typography>
                      <Tooltip title="Verifique nas curtidas do post se o nome do participante aparece">
                        <IconButton size="small" sx={{ ml: 1 }}>
                          <Info fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={marcouAmigos} 
                      onChange={(e) => setMarcouAmigos(e.target.checked)} 
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1">
                        Marcou pelo menos 3 amigos nos comentários
                      </Typography>
                      <Tooltip title="Verifique nos comentários se o participante marcou ao menos 3 amigos">
                        <IconButton size="small" sx={{ ml: 1 }}>
                          <Info fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                />
              </Box>
            </Paper>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={fecharValidacao} color="inherit">
              Cancelar
            </Button>
            <Button 
              onClick={validarGanhador} 
              variant="contained" 
              color="primary"
              startIcon={validacaoConcluida && !ganhadorValidado ? <Refresh /> : <Check />}
            >
              {validacaoConcluida && !ganhadorValidado ? "Tentar Novamente" : "Confirmar Verificação"}
            </Button>
          </DialogActions>
        </Dialog>
        {confetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
          />
        )}

        {/* Elementos decorativos com Framer Motion */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 100 - 50, 
                y: Math.random() * 100 - 50,
                opacity: 0.6
              }}
              animate={{ 
                x: Math.random() * 100 - 50, 
                y: Math.random() * 100 - 50,
                opacity: [0.4, 0.7, 0.4],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 8 + Math.random() * 10, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                width: 100 + Math.random() * 200 + 'px',
                height: 100 + Math.random() * 200 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                filter: 'blur(50px)',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </Box>

        <Container maxWidth="lg">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Box
              sx={{
                textAlign: 'center',
                mb: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h1"
                component="h1"
                color="white"
                gutterBottom
                sx={{
                  textShadow: '2px 4px 8px rgba(0,0,0,0.2)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <Favorite sx={{ fontSize: 40 }} /> Sorteio Dia das Mães
              </Typography>
              <Typography
                variant="subtitle1"
                color="white"
                sx={{
                  textShadow: '1px 2px 4px rgba(0,0,0,0.2)',
                  mb: 2,
                  fontWeight: 500,
                }}
              >
                Concorra a um Smartwatch Exclusivo
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <Chip 
                  icon={<Instagram />}
                  label={lojaInfo.nome} 
                  color="default"
                  sx={{ 
                    background: 'rgba(255,255,255,0.85)', 
                    fontWeight: 'bold',
                    mb: 1
                  }}
                />
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1, 
                    justifyContent: 'center',
                    maxWidth: '600px'
                  }}
                >
                  {lojaInfo.regras.map((regra, idx) => (
                    <Chip 
                      key={idx}
                      icon={idx === 0 ? <Star fontSize="small" /> : idx === 1 ? <ThumbUp fontSize="small" /> : <People fontSize="small" />}
                      label={regra} 
                      variant="outlined"
                      size="small"
                      sx={{ 
                        color: 'white', 
                        borderColor: 'rgba(255,255,255,0.5)',
                        '& .MuiChip-icon': { color: 'white' }
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <motion.div
                whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Chip
                  icon={<CardGiftcard />}
                  label="Prêmio Especial"
                  sx={{
                    background: 'linear-gradient(to right, #FFD700, #FFA500)',
                    color: 'white',
                    fontWeight: 'bold',
                    py: 2.5,
                    px: 1
                  }}
                />
              </motion.div>
            </Box>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <Paper
              elevation={3}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                mb: 4,
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(to right, #c13d90, #753b92)',
                  color: 'white',
                  py: 2,
                  px: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Instagram /> Participantes: {participantes.length}
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <AnimatePresence>
                    {participantes.map((participante, index) => {
                      // Cria um estilo único para cada participante
                      const isGanhador = ganhador === participante;
                      const isVerified = hasVerifiedBadge(participante);
                      const avatarGradient = getRandomGradient();
                      
                      return (
                        <Grid item key={index}>
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ 
                              duration: 0.4, 
                              delay: index * 0.03,
                              type: "spring",
                              stiffness: 260,
                              damping: 20 
                            }}
                            whileHover={{ scale: 1.05, y: -5 }}
                          >
                            <Paper
                              elevation={isGanhador ? 6 : 1}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 0.75,
                                pr: 2,
                                borderRadius: 8,
                                border: isGanhador ? '2px solid' : 'none',
                                borderColor: 'primary.main',
                                background: isGanhador ? 'linear-gradient(135deg, #fff6fb, #ffe6f2)' : 'white',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                },
                              }}
                            >
                              {/* Avatar estilo Instagram */}
                              <Box
                                sx={{
                                  position: 'relative',
                                  width: 48,
                                  height: 48,
                                  borderRadius: '50%',
                                  p: 0.25,
                                  mr: 1,
                                  background: isGanhador 
                                    ? 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' 
                                    : avatarGradient,
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <Box
                                  sx={{
                                    width: '90%',
                                    height: '90%',
                                    borderRadius: '50%',
                                    bgcolor: 'white',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: '94%',
                                      height: '94%',
                                      borderRadius: '50%',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      background: isGanhador ? 'linear-gradient(45deg, #f09433, #e6683c, #dc2743)' : '#f0f0f0',
                                      color: isGanhador ? 'white' : 'primary.dark',
                                      fontSize: '0.85rem',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    {getParticipantIcon(participante)}
                                  </Box>
                                </Box>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography
                                  variant="body2"
                                  sx={{ 
                                    fontWeight: isGanhador ? 600 : 500,
                                    fontSize: '0.9rem',
                                    color: isGanhador ? 'primary.dark' : 'text.primary',
                                  }}
                                >
                                  {participante}
                                </Typography>
                                
                                {isVerified && (
                                  <Verified 
                                    sx={{ 
                                      ml: 0.5, 
                                      fontSize: 16, 
                                      color: '#3897f0' // Cor azul verificado do Instagram
                                    }} 
                                  />
                                )}
                              </Box>
                            </Paper>
                          </motion.div>
                        </Grid>
                      );
                    })}
                  </AnimatePresence>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4,
                    px: 2,
                    minHeight: '200px',
                  }}
                >
                  <AnimatePresence mode="wait">
                    {!ganhador && !sorteando && (
                      <motion.div
                        key="botao-sortear"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.5, type: "spring" }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          disabled={sorteando}
                          onClick={iniciarSorteio}
                          startIcon={<EmojiEvents />}
                          sx={{ 
                            minWidth: 200, 
                            py: 1.5, 
                            fontSize: '1.2rem',
                            boxShadow: '0 8px 16px rgba(255, 123, 191, 0.3)' 
                          }}
                        >
                          INICIAR SORTEIO
                        </Button>
                      </motion.div>
                    )}

                    {sorteando && (
                      <motion.div
                        key="sorteando"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ textAlign: 'center' }}
                      >
                        <Box 
                          sx={{ 
                            mb: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                          }}
                        >
                          <Timer color="secondary" sx={{ fontSize: 40, mb: 2 }} />
                          
                          {/* Barra de progresso circular */}
                          <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                            <CircularProgress
                              variant="determinate"
                              value={percentualConcluido}
                              size={60}
                              thickness={4}
                              sx={{ color: 'secondary.main' }}
                            />
                            <Box
                              sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Typography variant="caption" component="div" color="text.secondary">
                                {Math.round(percentualConcluido)}%
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Typography variant="body1" color="text.secondary" gutterBottom>
                            Sorteando... ({tempoSorteio} segundos)
                          </Typography>
                        </Box>
                        
                        <motion.div
                          animate={{ scale: [0.9, 1.1, 0.9] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Paper
                            elevation={3}
                            sx={{ 
                              p: 3, 
                              background: 'linear-gradient(135deg, #ffe6f2, #f3e5ff)',
                              width: '100%',
                              borderRadius: 3,
                              mb: 2
                            }}
                          >
                            <Typography 
                              variant="h4" 
                              color="secondary.dark" 
                              fontWeight="bold"
                              sx={{ wordBreak: 'break-word' }}
                            >
                              {participanteAtual}
                            </Typography>
                          </Paper>
                        </motion.div>
                      </motion.div>
                    )}

                    {ganhador && !sorteando && (
                      <motion.div
                        key="resultado"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ textAlign: 'center' }}
                      >
                        <Typography variant="h5" color="primary" gutterBottom>
                          <Celebration sx={{ mr: 1, verticalAlign: 'middle' }} />
                          {validacaoConcluida && ganhadorValidado 
                            ? "Parabéns ao Ganhador Confirmado!" 
                            : "Possível Ganhador!"}
                        </Typography>

                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ 
                            duration: 0.8, 
                            delay: 0.3,
                            type: "spring",
                            stiffness: 100
                          }}
                        >
                          <Paper
                            elevation={5}
                            sx={{
                              py: 3,
                              px: 4,
                              my: 3,
                              background: validacaoConcluida && ganhadorValidado 
                                ? 'linear-gradient(135deg, #fff6fb, #ffe6f2)' 
                                : 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                              borderRadius: 4,
                              border: '2px solid',
                              borderColor: validacaoConcluida && ganhadorValidado ? 'primary.main' : 'action.disabled',
                              maxWidth: '100%',
                              mx: 'auto',
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                          >
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                opacity: 0.05,
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50L20 80 0 50 20 20z' fill='%23ff7bbf' fill-opacity='0.4'/%3E%3Cpath d='M50 50L80 80 100 50 80 20z' fill='%23ff7bbf' fill-opacity='0.4'/%3E%3C/svg%3E")`,
                                zIndex: 0
                              }}
                            />
                            
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                              {/* Instagram Style Profile Ring */}
                              <Box
                                sx={{
                                  position: 'relative',
                                  width: 80,
                                  height: 80,
                                  mx: 'auto',
                                  mb: 2,
                                  borderRadius: '50%',
                                  p: 0.5,
                                  background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <Box
                                  sx={{
                                    width: '92%',
                                    height: '92%',
                                    borderRadius: '50%',
                                    bgcolor: 'white',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: '94%',
                                      height: '94%',
                                      borderRadius: '50%',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      background: 'linear-gradient(45deg, #f09433, #dc2743)',
                                      color: 'white',
                                      fontSize: '1.5rem',
                                    }}
                                  >
                                    {getParticipantIcon(ganhador)}
                                  </Box>
                                </Box>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                <Typography 
                                  variant="h3" 
                                  color="secondary.dark" 
                                  sx={{ 
                                    fontWeight: 'bold',
                                    wordBreak: 'break-word'
                                  }}
                                >
                                  {ganhador}
                                </Typography>
                                
                                {hasVerifiedBadge(ganhador) && (
                                  <Verified 
                                    sx={{ 
                                      ml: 1, 
                                      fontSize: 24, 
                                      color: '#3897f0' 
                                    }} 
                                  />
                                )}
                              </Box>
                              
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 0.5,
                                  mb: 2
                                }}
                              >
                                <Chip 
                                  label={lojaInfo.nome} 
                                  icon={<Instagram />} 
                                  color="primary" 
                                  variant="outlined"
                                  size="small"
                                />
                              </Box>
                              
                              <Typography 
                                variant="subtitle1" 
                                color="text.secondary"
                                sx={{ mb: 3 }}
                              >
                                {validacaoConcluida && ganhadorValidado 
                                  ? "É a ganhadora oficial do Smartwatch!" 
                                  : "Aguardando verificação de requisitos..."}
                              </Typography>
                              
                              {/* Botões com condicionais baseadas na validação */}
                              {validacaoConcluida && ganhadorValidado ? (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={iniciarSorteio}
                                  startIcon={<Refresh />}
                                  sx={{ minWidth: 200 }}
                                >
                                  Sortear Novamente
                                </Button>
                              ) : validacaoConcluida && !ganhadorValidado ? (
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                                  <Button
                                    variant="contained"
                                    color="error"
                                    onClick={sortearNovamente}
                                    startIcon={<Refresh />}
                                  >
                                    Sortear Outro Participante
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={abrirValidacao}
                                    startIcon={<Info />}
                                  >
                                    Ver Detalhes
                                  </Button>
                                </Box>
                              ) : (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={abrirValidacao}
                                  startIcon={<Check />}
                                  sx={{ minWidth: 200 }}
                                >
                                  Verificar Requisitos
                                </Button>
                              )}
                            </Box>
                          </Paper>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
              </Box>
            </Paper>
          </motion.div>

          <Box 
            sx={{ 
              textAlign: 'center',
              color: 'white',
              mt: 2
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Sorteio realizado em {new Date().toLocaleDateString()}
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
} 