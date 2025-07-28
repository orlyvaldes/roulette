// Sistema de traducciones para la aplicación de ruleta
const translations = {
    en: {
        // Títulos principales
        title: "🎡 Roulette Generator - Create Your Custom Roulette",
        mainHeading: "🎡 Roulette Generator",
        ruletteTitle: "🎯 Your Custom Roulette is Ready!",
        ruletteHeading: "🎯 Spin the Roulette!",
        
        // Instrucciones
        instructionsTitle: "📋 Instructions:",
        instruction1: "Choose the game mode (Normal or Elimination)",
        instruction2: "Select the number of segments (2-20)",
        instruction3: "Write the text for each segment",
        instruction4: "Select unique colors for each segment",
        instruction5: "Create your custom roulette!",
        
        // Modos de juego
        gameModeTitle: "🎮 Game Mode:",
        normalMode: "🎯 Normal",
        normalModeDesc: "Spin infinite times",
        eliminationMode: "🏆 Elimination",
        eliminationModeDesc: "Options are eliminated until finding the winner",
        
        // Formulario
        segmentsLabel: "🔢 Number of segments:",
        segmentPlaceholder: "Ex: Option",
        createButton: "🎯 Create My Roulette",
        
        // Botones de la ruleta
        spinButton: "🎲 Spin Roulette",
        resetButton: "🔄 Reset",
        newRouletteButton: "➕ New Roulette",
        round: "Round",
        
        // Estadísticas
        statsTitle: "📊 Your Roulette Information",
        segments: "Segments",
        initialProbability: "Initial Probability",
        maxRounds: "Max Rounds",
        possibleSpins: "Possible Spins",
        eliminationModeInfo: "🏆 Elimination Mode: Segments are eliminated one by one until finding the final winner",
        
        // Segmentos
        segmentsTitle: "🎨 Your Roulette Segments",
        
        // Resultados
        eliminated: "🚫 Eliminated!",
        winner: "🎉 We Have a Winner!",
        finalPosition: "Final Position:",
        eliminatedIn: "Eliminated in:",
        remaining: "Remaining:",
        finalist: "finalist",
        options: "options",
        continue: "Continue",
        finalRound: "🏆 Final Round",
        close: "Close",
        newGame: "New Roulette",
        gameFinished: "🏆 Game Finished",
        
        // Clasificación
        finalClassification: "🏆 Final Classification:",
        winner_pos: "WINNER",
        second_place: "2ND PLACE",
        third_place: "3RD PLACE",
        place: "PLACE",
        
        // Eliminación en tiempo real
        eliminationMode_title: "🏆 Elimination Mode - Round",
        remaining_count: "Remaining",
        eliminated_count: "Eliminated",
        eliminatedOrder: "📋 Eliminated (from last to first):",
        
        // Alertas
        segmentsBetween: "The number of segments must be between",
        and: "and",
        allSegmentsMustHaveText: "⚠️ All segments must have text",
        allSegmentsMustHaveColor: "⚠️ All segments must have a selected color",
        numberBetween: "The number must be between",
        selectGameMode: "Please select a game mode",
        formFieldsError: "Error: Some form fields are missing. Please reload the page and try again.",
        segmentValidationError: "Error in segment validation. Please try again.",
        
        // Estados de la ruleta
        spinning: "🌀 Spinning...",
        
        // Selector de idioma
        language: "Language",
        
        // Posiciones ordinales
        "1st": "1st",
        "2nd": "2nd", 
        "3rd": "3rd",
        "4th": "4th",
        "5th": "5th",
        "6th": "6th",
        "7th": "7th",
        "8th": "8th",
        "9th": "9th",
        "10th": "10th",
        "11th": "11th",
        "12th": "12th",
        "13th": "13th",
        "14th": "14th",
        "15th": "15th",
        "16th": "16th",
        "17th": "17th",
        "18th": "18th",
        "19th": "19th",
        "20th": "20th"
    },
    
    es: {
        // Títulos principales
        title: "🎡 Generador de Ruleta - Crea tu Ruleta Personalizada",
        mainHeading: "🎡 Generador de Ruleta",
        ruletteTitle: "🎯 ¡Tu Ruleta Está Lista!",
        ruletteHeading: "🎯 ¡Gira la Ruleta!",
        
        // Instrucciones
        instructionsTitle: "📋 Instrucciones:",
        instruction1: "Elige el modo de juego (Normal o Eliminación)",
        instruction2: "Selecciona el número de segmentos (2-20)",
        instruction3: "Escribe el texto para cada segmento",
        instruction4: "Selecciona colores únicos para cada segmento",
        instruction5: "¡Crea tu ruleta personalizada!",
        
        // Modos de juego
        gameModeTitle: "🎮 Modo de Juego:",
        normalMode: "🎯 Normal",
        normalModeDesc: "Gira infinitas veces",
        eliminationMode: "🏆 Eliminación",
        eliminationModeDesc: "Se eliminan opciones hasta quedar el ganador",
        
        // Formulario
        segmentsLabel: "🔢 Número de segmentos:",
        segmentPlaceholder: "Ej: Opción",
        createButton: "🎯 Crear Mi Ruleta",
        
        // Botones de la ruleta
        spinButton: "🎲 Girar Ruleta",
        resetButton: "🔄 Reiniciar",
        newRouletteButton: "➕ Nueva Ruleta",
        round: "Ronda",
        
        // Estadísticas
        statsTitle: "📊 Información de tu Ruleta",
        segments: "Segmentos",
        initialProbability: "Probabilidad Inicial",
        maxRounds: "Rondas Máximas",
        possibleSpins: "Giros Posibles",
        eliminationModeInfo: "🏆 Modo Eliminación: Los segmentos se eliminan uno por uno hasta encontrar el ganador final",
        
        // Segmentos
        segmentsTitle: "🎨 Segmentos de tu Ruleta",
        
        // Resultados
        eliminated: "🚫 ¡Eliminado!",
        winner: "🎉 ¡Tenemos Ganador!",
        finalPosition: "Posición Final:",
        eliminatedIn: "Eliminado en:",
        remaining: "Quedan:",
        finalist: "finalista",
        options: "opciones",
        continue: "Continuar",
        finalRound: "🏆 Ronda Final",
        close: "Cerrar",
        newGame: "Nueva Ruleta",
        gameFinished: "🏆 Juego Terminado",
        
        // Clasificación
        finalClassification: "🏆 Clasificación Final:",
        winner_pos: "GANADOR",
        second_place: "2º LUGAR",
        third_place: "3º LUGAR",
        place: "LUGAR",
        
        // Eliminación en tiempo real
        eliminationMode_title: "🏆 Modo Eliminación - Ronda",
        remaining_count: "Quedan",
        eliminated_count: "Eliminados",
        eliminatedOrder: "📋 Eliminados (del último al primero):",
        
        // Alertas
        segmentsBetween: "El número de segmentos debe estar entre",
        and: "y",
        allSegmentsMustHaveText: "⚠️ Todos los segmentos deben tener texto",
        allSegmentsMustHaveColor: "⚠️ Todos los segmentos deben tener un color seleccionado",
        numberBetween: "El número debe estar entre",
        selectGameMode: "Por favor selecciona un modo de juego",
        formFieldsError: "Error: Algunos campos del formulario faltan. Por favor recarga la página e inténtalo de nuevo.",
        segmentValidationError: "Error en la validación de segmentos. Por favor inténtalo de nuevo.",
        
        // Estados de la ruleta
        spinning: "🌀 Girando...",
        
        // Selector de idioma
        language: "Idioma",
        
        // Posiciones ordinales
        "1st": "1º",
        "2nd": "2º", 
        "3rd": "3º",
        "4th": "4º",
        "5th": "5º",
        "6th": "6º",
        "7th": "7º",
        "8th": "8º",
        "9th": "9º",
        "10th": "10º",
        "11th": "11º",
        "12th": "12º",
        "13th": "13º",
        "14th": "14º",
        "15th": "15º",
        "16th": "16º",
        "17th": "17º",
        "18th": "18º",
        "19th": "19º",
        "20th": "20º"
    },
    
    fr: {
        // Títulos principales
        title: "🎡 Générateur de Roulette - Créez votre Roulette Personnalisée",
        mainHeading: "🎡 Générateur de Roulette",
        ruletteTitle: "🎯 Votre Roulette est Prête!",
        ruletteHeading: "🎯 Faites Tourner la Roulette!",
        
        // Instrucciones
        instructionsTitle: "📋 Instructions:",
        instruction1: "Choisissez le mode de jeu (Normal ou Élimination)",
        instruction2: "Sélectionnez le nombre de segments (2-20)",
        instruction3: "Écrivez le texte pour chaque segment",
        instruction4: "Sélectionnez des couleurs uniques pour chaque segment",
        instruction5: "Créez votre roulette personnalisée!",
        
        // Modos de juego
        gameModeTitle: "🎮 Mode de Jeu:",
        normalMode: "🎯 Normal",
        normalModeDesc: "Tournez à l'infini",
        eliminationMode: "🏆 Élimination",
        eliminationModeDesc: "Les options sont éliminées jusqu'à trouver le gagnant",
        
        // Formulario
        segmentsLabel: "🔢 Nombre de segments:",
        segmentPlaceholder: "Ex: Option",
        createButton: "🎯 Créer Ma Roulette",
        
        // Botones de la ruleta
        spinButton: "🎲 Faire Tourner",
        resetButton: "🔄 Réinitialiser",
        newRouletteButton: "➕ Nouvelle Roulette",
        round: "Tour",
        
        // Estadísticas
        statsTitle: "📊 Informations de votre Roulette",
        segments: "Segments",
        initialProbability: "Probabilité Initiale",
        maxRounds: "Tours Maximum",
        possibleSpins: "Tours Possibles",
        eliminationModeInfo: "🏆 Mode Élimination: Les segments sont éliminés un par un jusqu'à trouver le gagnant final",
        
        // Segmentos
        segmentsTitle: "🎨 Segments de votre Roulette",
        
        // Resultados
        eliminated: "🚫 Éliminé!",
        winner: "🎉 Nous Avons un Gagnant!",
        finalPosition: "Position Finale:",
        eliminatedIn: "Éliminé au:",
        remaining: "Restant:",
        finalist: "finaliste",
        options: "options",
        continue: "Continuer",
        finalRound: "🏆 Tour Final",
        close: "Fermer",
        newGame: "Nouvelle Roulette",
        gameFinished: "🏆 Jeu Terminé",
        
        // Clasificación
        finalClassification: "🏆 Classement Final:",
        winner_pos: "GAGNANT",
        second_place: "2ÈME PLACE",
        third_place: "3ÈME PLACE",
        place: "PLACE",
        
        // Eliminación en tiempo real
        eliminationMode_title: "🏆 Mode Élimination - Tour",
        remaining_count: "Restant",
        eliminated_count: "Éliminés",
        eliminatedOrder: "📋 Éliminés (du dernier au premier):",
        
        // Alertas
        segmentsBetween: "Le nombre de segments doit être entre",
        and: "et",
        allSegmentsMustHaveText: "⚠️ Tous les segments doivent avoir du texte",
        allSegmentsMustHaveColor: "⚠️ Tous les segments doivent avoir une couleur sélectionnée",
        numberBetween: "Le nombre doit être entre",
        selectGameMode: "Veuillez sélectionner un mode de jeu",
        formFieldsError: "Erreur: Certains champs du formulaire sont manquants. Veuillez recharger la page et réessayer.",
        segmentValidationError: "Erreur dans la validation des segments. Veuillez réessayer.",
        
        // Estados de la ruleta
        spinning: "🌀 En rotation...",
        
        // Selector de idioma
        language: "Langue",
        
        // Posiciones ordinales
        "1st": "1er",
        "2nd": "2ème", 
        "3rd": "3ème",
        "4th": "4ème",
        "5th": "5ème",
        "6th": "6ème",
        "7th": "7ème",
        "8th": "8ème",
        "9th": "9ème",
        "10th": "10ème",
        "11th": "11ème",
        "12th": "12ème",
        "13th": "13ème",
        "14th": "14ème",
        "15th": "15ème",
        "16th": "16ème",
        "17th": "17ème",
        "18th": "18ème",
        "19th": "19ème",
        "20th": "20ème"
    },
    
    ja: {
        // Títulos principales
        title: "🎡 ルーレット生成器 - カスタムルーレットを作成",
        mainHeading: "🎡 ルーレット生成器",
        ruletteTitle: "🎯 あなたのルーレットが完成しました！",
        ruletteHeading: "🎯 ルーレットを回そう！",
        
        // Instrucciones
        instructionsTitle: "📋 手順:",
        instruction1: "ゲームモードを選択（通常または淘汰）",
        instruction2: "セグメント数を選択（2-20）",
        instruction3: "各セグメントのテキストを入力",
        instruction4: "各セグメントに固有の色を選択",
        instruction5: "カスタムルーレットを作成！",
        
        // Modos de juego
        gameModeTitle: "🎮 ゲームモード:",
        normalMode: "🎯 通常",
        normalModeDesc: "無限に回転",
        eliminationMode: "🏆 淘汰",
        eliminationModeDesc: "勝者が決まるまでオプションを淘汰",
        
        // Formulario
        segmentsLabel: "🔢 セグメント数:",
        segmentPlaceholder: "例: オプション",
        createButton: "🎯 マイルーレットを作成",
        
        // Botones de la ruleta
        spinButton: "🎲 ルーレットを回す",
        resetButton: "🔄 リセット",
        newRouletteButton: "➕ 新しいルーレット",
        round: "ラウンド",
        
        // Estadísticas
        statsTitle: "📊 あなたのルーレット情報",
        segments: "セグメント",
        initialProbability: "初期確率",
        maxRounds: "最大ラウンド",
        possibleSpins: "可能な回転",
        eliminationModeInfo: "🏆 淘汰モード: 最終勝者が決まるまでセグメントが一つずつ淘汰されます",
        
        // Segmentos
        segmentsTitle: "🎨 あなたのルーレットセグメント",
        
        // Resultados
        eliminated: "🚫 淘汰！",
        winner: "🎉 勝者決定！",
        finalPosition: "最終順位:",
        eliminatedIn: "淘汰ラウンド:",
        remaining: "残り:",
        finalist: "ファイナリスト",
        options: "オプション",
        continue: "続行",
        finalRound: "🏆 最終ラウンド",
        close: "閉じる",
        newGame: "新しいルーレット",
        gameFinished: "🏆 ゲーム終了",
        
        // Clasificación
        finalClassification: "🏆 最終順位:",
        winner_pos: "勝者",
        second_place: "2位",
        third_place: "3位",
        place: "位",
        
        // Eliminación en tiempo real
        eliminationMode_title: "🏆 淘汰モード - ラウンド",
        remaining_count: "残り",
        eliminated_count: "淘汰済み",
        eliminatedOrder: "📋 淘汰順（最後から最初へ）:",
        
        // Alertas
        segmentsBetween: "セグメント数は",
        and: "から",
        allSegmentsMustHaveText: "⚠️ すべてのセグメントにテキストが必要です",
        allSegmentsMustHaveColor: "⚠️ すべてのセグメントに色を選択してください",
        numberBetween: "数値は",
        selectGameMode: "ゲームモードを選択してください",
        formFieldsError: "エラー: フォームフィールドが不足しています。ページを再読み込みして再試行してください。",
        segmentValidationError: "セグメント検証エラー。再試行してください。",
        
        // Estados de la ruleta
        spinning: "🌀 回転中...",
        
        // Selector de idioma
        language: "言語",
        
        // Posiciones ordinales
        "1st": "1位",
        "2nd": "2位", 
        "3rd": "3位",
        "4th": "4位",
        "5th": "5位",
        "6th": "6位",
        "7th": "7位",
        "8th": "8位",
        "9th": "9位",
        "10th": "10位",
        "11th": "11位",
        "12th": "12位",
        "13th": "13位",
        "14th": "14位",
        "15th": "15位",
        "16th": "16位",
        "17th": "17位",
        "18th": "18位",
        "19th": "19位",
        "20th": "20位"
    },
    
    it: {
        // Títulos principales
        title: "🎡 Generatore di Roulette - Crea la tua Roulette Personalizzata",
        mainHeading: "🎡 Generatore di Roulette",
        ruletteTitle: "🎯 La tua Roulette è Pronta!",
        ruletteHeading: "🎯 Gira la Roulette!",
        
        // Instrucciones
        instructionsTitle: "📋 Istruzioni:",
        instruction1: "Scegli la modalità di gioco (Normale o Eliminazione)",
        instruction2: "Seleziona il numero di segmenti (2-20)",
        instruction3: "Scrivi il testo per ogni segmento",
        instruction4: "Seleziona colori unici per ogni segmento",
        instruction5: "Crea la tua roulette personalizzata!",
        
        // Modos de juego
        gameModeTitle: "🎮 Modalità di Gioco:",
        normalMode: "🎯 Normale",
        normalModeDesc: "Gira infinite volte",
        eliminationMode: "🏆 Eliminazione",
        eliminationModeDesc: "Le opzioni vengono eliminate fino a trovare il vincitore",
        
        // Formulario
        segmentsLabel: "🔢 Numero di segmenti:",
        segmentPlaceholder: "Es: Opzione",
        createButton: "🎯 Crea la Mia Roulette",
        
        // Botones de la ruleta
        spinButton: "🎲 Gira Roulette",
        resetButton: "🔄 Ripristina",
        newRouletteButton: "➕ Nuova Roulette",
        round: "Round",
        
        // Estadísticas
        statsTitle: "📊 Informazioni della tua Roulette",
        segments: "Segmenti",
        initialProbability: "Probabilità Iniziale",
        maxRounds: "Round Massimi",
        possibleSpins: "Giri Possibili",
        eliminationModeInfo: "🏆 Modalità Eliminazione: I segmenti vengono eliminati uno per uno fino a trovare il vincitore finale",
        
        // Segmentos
        segmentsTitle: "🎨 Segmenti della tua Roulette",
        
        // Resultados
        eliminated: "🚫 Eliminato!",
        winner: "🎉 Abbiamo un Vincitore!",
        finalPosition: "Posizione Finale:",
        eliminatedIn: "Eliminato al:",
        remaining: "Rimanenti:",
        finalist: "finalista",
        options: "opzioni",
        continue: "Continua",
        finalRound: "🏆 Round Finale",
        close: "Chiudi",
        newGame: "Nuova Roulette",
        gameFinished: "🏆 Gioco Finito",
        
        // Clasificación
        finalClassification: "🏆 Classifica Finale:",
        winner_pos: "VINCITORE",
        second_place: "2° POSTO",
        third_place: "3° POSTO",
        place: "POSTO",
        
        // Eliminación en tiempo real
        eliminationMode_title: "🏆 Modalità Eliminazione - Round",
        remaining_count: "Rimanenti",
        eliminated_count: "Eliminati",
        eliminatedOrder: "📋 Eliminati (dall'ultimo al primo):",
        
        // Alertas
        segmentsBetween: "Il numero di segmenti deve essere tra",
        and: "e",
        allSegmentsMustHaveText: "⚠️ Tutti i segmenti devono avere del testo",
        allSegmentsMustHaveColor: "⚠️ Tutti i segmenti devono avere un colore selezionato",
        numberBetween: "Il numero deve essere tra",
        selectGameMode: "Seleziona una modalità di gioco",
        formFieldsError: "Errore: Alcuni campi del modulo sono mancanti. Ricarica la pagina e riprova.",
        segmentValidationError: "Errore nella validazione dei segmenti. Riprova.",
        
        // Estados de la ruleta
        spinning: "🌀 Girando...",
        
        // Selector de idioma
        language: "Lingua",
        
        // Posiciones ordinales
        "1st": "1°",
        "2nd": "2°", 
        "3rd": "3°",
        "4th": "4°",
        "5th": "5°",
        "6th": "6°",
        "7th": "7°",
        "8th": "8°",
        "9th": "9°",
        "10th": "10°",
        "11th": "11°",
        "12th": "12°",
        "13th": "13°",
        "14th": "14°",
        "15th": "15°",
        "16th": "16°",
        "17th": "17°",
        "18th": "18°",
        "19th": "19°",
        "20th": "20°"
    },
    
    pt: {
        // Títulos principales
        title: "🎡 Gerador de Roleta - Crie sua Roleta Personalizada",
        mainHeading: "🎡 Gerador de Roleta",
        ruletteTitle: "🎯 Sua Roleta está Pronta!",
        ruletteHeading: "🎯 Gire a Roleta!",
        
        // Instrucciones
        instructionsTitle: "📋 Instruções:",
        instruction1: "Escolha o modo de jogo (Normal ou Eliminação)",
        instruction2: "Selecione o número de segmentos (2-20)",
        instruction3: "Escreva o texto para cada segmento",
        instruction4: "Selecione cores únicas para cada segmento",
        instruction5: "Crie sua roleta personalizada!",
        
        // Modos de juego
        gameModeTitle: "🎮 Modo de Jogo:",
        normalMode: "🎯 Normal",
        normalModeDesc: "Gire infinitas vezes",
        eliminationMode: "🏆 Eliminação",
        eliminationModeDesc: "Opções são eliminadas até encontrar o vencedor",
        
        // Formulario
        segmentsLabel: "🔢 Número de segmentos:",
        segmentPlaceholder: "Ex: Opção",
        createButton: "🎯 Criar Minha Roleta",
        
        // Botones de la ruleta
        spinButton: "🎲 Girar Roleta",
        resetButton: "🔄 Reiniciar",
        newRouletteButton: "➕ Nova Roleta",
        round: "Rodada",
        
        // Estadísticas
        statsTitle: "📊 Informações da sua Roleta",
        segments: "Segmentos",
        initialProbability: "Probabilidade Inicial",
        maxRounds: "Rodadas Máximas",
        possibleSpins: "Giros Possíveis",
        eliminationModeInfo: "🏆 Modo Eliminação: Os segmentos são eliminados um por um até encontrar o vencedor final",
        
        // Segmentos
        segmentsTitle: "🎨 Segmentos da sua Roleta",
        
        // Resultados
        eliminated: "🚫 Eliminado!",
        winner: "🎉 Temos um Vencedor!",
        finalPosition: "Posição Final:",
        eliminatedIn: "Eliminado na:",
        remaining: "Restantes:",
        finalist: "finalista",
        options: "opções",
        continue: "Continuar",
        finalRound: "🏆 Rodada Final",
        close: "Fechar",
        newGame: "Nova Roleta",
        gameFinished: "🏆 Jogo Terminado",
        
        // Clasificación
        finalClassification: "🏆 Classificação Final:",
        winner_pos: "VENCEDOR",
        second_place: "2º LUGAR",
        third_place: "3º LUGAR",
        place: "LUGAR",
        
        // Eliminación en tiempo real
        eliminationMode_title: "🏆 Modo Eliminação - Rodada",
        remaining_count: "Restantes",
        eliminated_count: "Eliminados",
        eliminatedOrder: "📋 Eliminados (do último ao primeiro):",
        
        // Alertas
        segmentsBetween: "O número de segmentos deve estar entre",
        and: "e",
        allSegmentsMustHaveText: "⚠️ Todos os segmentos devem ter texto",
        allSegmentsMustHaveColor: "⚠️ Todos os segmentos devem ter uma cor selecionada",
        numberBetween: "O número deve estar entre",
        selectGameMode: "Por favor selecione um modo de jogo",
        formFieldsError: "Erro: Alguns campos do formulário estão faltando. Recarregue a página e tente novamente.",
        segmentValidationError: "Erro na validação de segmentos. Tente novamente.",
        
        // Estados de la ruleta
        spinning: "🌀 Girando...",
        
        // Selector de idioma
        language: "Idioma",
        
        // Posiciones ordinales
        "1st": "1º",
        "2nd": "2º", 
        "3rd": "3º",
        "4th": "4º",
        "5th": "5º",
        "6th": "6º",
        "7th": "7º",
        "8th": "8º",
        "9th": "9º",
        "10th": "10º",
        "11th": "11º",
        "12th": "12º",
        "13th": "13º",
        "14th": "14º",
        "15th": "15º",
        "16th": "16º",
        "17th": "17º",
        "18th": "18º",
        "19th": "19º",
        "20th": "20º"
    }
};

// Sistema de gestión de idiomas
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('roulette-language') || 'en';
        this.init();
    }
    
    init() {
        this.updateLanguage(this.currentLanguage);
        this.createLanguageSelector();
    }
    
    createLanguageSelector() {
        const selector = document.createElement('div');
        selector.className = 'language-selector';
        selector.innerHTML = `
            <div class="language-dropdown">
                <button class="language-btn" onclick="languageManager.toggleDropdown()">
                    <span class="language-flag">${this.getFlagEmoji(this.currentLanguage)}</span>
                    <span class="language-name">${this.getLanguageName(this.currentLanguage)}</span>
                    <span class="dropdown-arrow">▼</span>
                </button>
                <div class="language-options" id="languageOptions">
                    <div class="language-option" onclick="languageManager.changeLanguage('en')">
                        <span class="language-flag">🇺🇸</span>
                        <span>English</span>
                    </div>
                    <div class="language-option" onclick="languageManager.changeLanguage('es')">
                        <span class="language-flag">🇪🇸</span>
                        <span>Español</span>
                    </div>
                    <div class="language-option" onclick="languageManager.changeLanguage('fr')">
                        <span class="language-flag">🇫🇷</span>
                        <span>Français</span>
                    </div>
                    <div class="language-option" onclick="languageManager.changeLanguage('ja')">
                        <span class="language-flag">🇯🇵</span>
                        <span>日本語</span>
                    </div>
                    <div class="language-option" onclick="languageManager.changeLanguage('it')">
                        <span class="language-flag">🇮🇹</span>
                        <span>Italiano</span>
                    </div>
                    <div class="language-option" onclick="languageManager.changeLanguage('pt')">
                        <span class="language-flag">🇵🇹</span>
                        <span>Português</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(selector);
    }
    
    getFlagEmoji(lang) {
        const flags = {
            'en': '🇺🇸',
            'es': '🇪🇸', 
            'fr': '🇫🇷',
            'ja': '🇯🇵',
            'it': '🇮🇹',
            'pt': '🇵🇹'
        };
        return flags[lang] || '🇺🇸';
    }
    
    getLanguageName(lang) {
        const names = {
            'en': 'English',
            'es': 'Español',
            'fr': 'Français', 
            'ja': '日本語',
            'it': 'Italiano',
            'pt': 'Português'
        };
        return names[lang] || 'English';
    }
    
    toggleDropdown() {
        const options = document.getElementById('languageOptions');
        options.classList.toggle('show');
    }
    
    changeLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('roulette-language', lang);
        this.updateLanguage(lang);
        this.toggleDropdown();
        
        // Actualizar el botón del selector
        const btn = document.querySelector('.language-btn');
        btn.innerHTML = `
            <span class="language-flag">${this.getFlagEmoji(lang)}</span>
            <span class="language-name">${this.getLanguageName(lang)}</span>
            <span class="dropdown-arrow">▼</span>
        `;
    }
    
    updateLanguage(lang) {
        const t = translations[lang] || translations['en'];
        
        // Actualizar título de la página
        document.title = t.title;
        
        // Actualizar todos los elementos con data-translate
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (t[key]) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = t[key];
                } else {
                    element.textContent = t[key];
                }
            }
        });
        
        // Actualizar placeholders específicos
        document.querySelectorAll('input[name^="text_"]').forEach(input => {
            const index = input.name.split('_')[1];
            input.placeholder = `${t.segmentPlaceholder} ${parseInt(index) + 1}`;
        });
    }
    
    t(key) {
        const t = translations[this.currentLanguage] || translations['en'];
        return t[key] || key;
    }
}

// Inicializar el gestor de idiomas
let languageManager;
document.addEventListener('DOMContentLoaded', function() {
    languageManager = new LanguageManager();
});

// Cerrar dropdown al hacer clic fuera
document.addEventListener('click', function(event) {
    if (!event.target.closest('.language-selector')) {
        const options = document.getElementById('languageOptions');
        if (options) {
            options.classList.remove('show');
        }
    }
});