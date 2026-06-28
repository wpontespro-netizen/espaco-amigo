update public.psychologists
set
  nome = 'Wagner da Silva Pontes',
  crp = '05/184392',
  especialidade_principal = 'Psicologia analítica',
  outras_especialidades = 'Autoconhecimento, relações, transições de vida e organização emocional',
  bio = 'Psicólogo com escuta acolhedora para pessoas em momentos de confusão, angústia e busca por sentido.',
  foto_url = 'https://ui-avatars.com/api/?name=Wagner+da+Silva+Pontes&background=9f82ff&color=ffffff&size=256',
  horas_semanais = '10h semanais',
  horarios_disponiveis = 'Segunda e quarta, 18h às 21h. Sábado, 9h às 12h.',
  cidade = 'Rio de Janeiro',
  estado = 'RJ',
  status = 'aprovado',
  updated_at = now()
where lower(email) = 'wagner.psicologo.seed@espacoamigo.com'
   or lower(nome) = 'wagner da silva pontes';

update public.psychologists
set
  nome = 'Marcelo Antunes',
  crp = '05/216847',
  especialidade_principal = 'Acolhimento emocional',
  outras_especialidades = 'Rotina emocional, solidão, medo, autoestima e relações',
  bio = 'Psicólogo dedicado ao acolhimento inicial de pessoas que precisam falar com calma e organizar o que sentem.',
  foto_url = 'https://ui-avatars.com/api/?name=Marcelo+Antunes&background=73d7ff&color=071027&size=256',
  horas_semanais = '8h semanais',
  horarios_disponiveis = 'Terça e quinta, 19h às 22h. Sexta, 17h às 19h.',
  cidade = 'Rio de Janeiro',
  estado = 'RJ',
  status = 'aprovado',
  updated_at = now()
where lower(email) = 'marcelo.antunes.seed@espacoamigo.com'
   or lower(nome) = 'marcelo antunes';

update public.psychologists
set
  nome = 'Vitor Dias Pontes',
  crp = '05/203571',
  especialidade_principal = 'Ansiedade e rotina emocional',
  outras_especialidades = 'Preocupação, pensamentos acelerados, rotina, estudo e organização emocional',
  bio = 'Psicólogo com foco em acolher pessoas que enfrentam ansiedade cotidiana, excesso de pensamentos e cansaço emocional.',
  foto_url = 'https://ui-avatars.com/api/?name=Vitor+Dias+Pontes&background=ff9c91&color=071027&size=256',
  horas_semanais = '12h semanais',
  horarios_disponiveis = 'Segunda, terça e quinta, 18h às 21h.',
  cidade = 'Araruama',
  estado = 'RJ',
  status = 'aprovado',
  updated_at = now()
where lower(email) = 'vitor.dias.seed@espacoamigo.com'
   or lower(nome) = 'vitor dias pontes';
