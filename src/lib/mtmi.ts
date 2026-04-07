// node_modules/mtmi/dist/mtmi.d.ts

export type UserMessageInfoType = {
  type: string;
  username: string;
  channel: string;
  message: string;
  badges: Array<BadgeInfoType>;
  userInfo: UserInfoType;
  messageInfo: MessageInfoType;
  replyInfo?: ReplyInfoType;
  bitsInfo?: BitsGroupType;
  raw: string;
}

/**
 * Badges que el usuario tiene visibles en el chat.
 */
export type BadgeInfoType = {
  /** Nombre del badge. */
  name: string;
  /** Valor asociado al badge. */
  value: number;
  /** Imagen identificativa del badge. */
  image: string;
  /** Descripción del badge. */
  description: string;
  /** Número completo de meses. */
  fullMonths?: number;
  /** Número del fundador. */
  founderNumber?: number;
  /** El usuario ha votado una predicción. */
  predictionInfo?: string;
}

export type UserInfoType = {
  username: string;
  displayName: string;
  color: ColorType | PremiumColorType;
  isVip: boolean;
  isMod: boolean;
  isSub: boolean;
  isTurbo: boolean;
  isPrime: boolean;
  isBot: boolean;
}

type MessageInfoType = {
  id: string;
  isFirstMessage: boolean;
  isReturningChatter: boolean;
  isEmoteOnly: boolean;
  isHighlightedMessage: boolean;
  isGigantifiedEmoteMessage: boolean;
  isAnimatedMessage: boolean;
  flagsInfo?: FlagsType;
  roomId: number;
  userId: number;
  tmi: number;
  msgId: string;
  messageData: Array<Object>;
  message: HTMLSpanElement;
  rawMessage: string;
}

type ReplyInfoType = ReplyType | object;

interface ReplyType extends ReplyParentType, ReplyThreadType {
  type: string;
}

type ReplyParentType = {
  displayName: String;
  msgBody: String;
  msgId: String;
  userId: Number;
  userLogin: String;
}
type ReplyThreadType = {
  parentMsgId: String;
  parentUserLogin: String;
}

type BitsInfoType = {
  bits: number;
}

type BitsGroupType = BitsInfoType | object;

type ColorType = "#ff0000" | "#0000ff" | "#008000" | "#b22222" | "#ff7f50" | "#9acd32" | "#ff4500" | "#2e8b57" | "#daa520" | "#d2691e" | "#5f9ea0" | "#1e90ff" | "#ff69b4" | "#8a2be2" | "#00ff7f";

type PremiumColorType = string;

type FlagsType = FlagFragmentType | Object;

type FlagFragmentType = {
  messageFragment: string;
  scoreList: Array<ScoreType>;
}

/**
 *
 * ISCORE: Identity language (raza, religión, género, orientación, discapacidad, hate...)
 * SSCORE: Sexually explicit language (palabras de tipo sexual, partes íntimas...)
 * ASCORE: Aggressive language (hostilidad, bullying...)
 * PSCORE: Profanity (lenguaje vulgar, útil para mantener un chat family-friendly)
 */
type ScoreFlagType = "ISCORE" | "SSCORE" | "ASCORE" | "PSCORE";
type ScoreType = {
  flag: ScoreFlagType;
  level: number;
}