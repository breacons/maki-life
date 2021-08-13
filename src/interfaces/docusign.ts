export interface Sender {
  userName: string;
  userId: string;
  accountId: string;
  email: string;
}

export interface Owner {
  userId: string;
  email: string;
}

export interface Folder {
  name: string;
  type: string;
  owner: Owner;
  folderId: string;
  uri: string;
}

export interface SignatureInfo {
  signatureName: string;
  signatureInitials: string;
  fontStyle: string;
}

export interface SignHereTab {
  stampType: string;
  name: string;
  tabLabel: string;
  scaleValue: string;
  optional: string;
  documentId: string;
  recipientId: string;
  pageNumber: string;
  xPosition: string;
  yPosition: string;
  tabId: string;
  status: string;
  tabType: string;
}

export interface Tabs {
  signHereTabs: SignHereTab[];
}

export interface Signer {
  signatureInfo: SignatureInfo;
  tabs: Tabs;
  creationReason: string;
  isBulkRecipient: string;
  recipientSuppliesTabs: string;
  requireUploadSignature: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  recipientId: string;
  recipientIdGuid: string;
  requireIdLookup: string;
  userId: string;
  clientUserId: string;
  routingOrder: string;
  status: string;
  completedCount: string;
  signedDateTime: Date;
  deliveredDateTime: Date;
  deliveryMethod: string;
  totalTabCount: string;
  recipientType: string;
}

export interface Recipients {
  signers: Signer[];
  agents: any[];
  editors: any[];
  intermediaries: any[];
  carbonCopies: any[];
  certifiedDeliveries: any[];
  inPersonSigners: any[];
  seals: any[];
  witnesses: any[];
  notaries: any[];
  recipientCount: string;
  currentRoutingOrder: string;
}

export interface EnvelopeMetadata {
  allowAdvancedCorrect: string;
  enableSignWithNotary: string;
  allowCorrect: string;
}

export interface Envelope {
  status: string;
  statusDateTime: string;
  documentsUri: string;
  recipientsUri: string;
  attachmentsUri: string;
  envelopeUri: string;
  emailSubject: string;
  envelopeId: string;
  signingLocation: string;
  customFieldsUri: string;
  notificationUri: string;
  enableWetSign: string;
  allowMarkup: string;
  allowReassign: string;
  createdDateTime: Date;
  lastModifiedDateTime: Date;
  deliveredDateTime: Date;
  initialSentDateTime: Date;
  sentDateTime: Date;
  completedDateTime: Date;
  statusChangedDateTime: Date;
  documentsCombinedUri: string;
  certificateUri: string;
  templatesUri: string;
  expireEnabled: string;
  expireDateTime: Date;
  expireAfter: string;
  sender: Sender;
  folders: Folder[];
  recipients: Recipients;
  purgeState: string;
  envelopeIdStamping: string;
  is21CFRPart11: string;
  signerCanSignOnMobile: string;
  autoNavigation: string;
  isSignatureProviderEnvelope: string;
  hasFormDataChanged: string;
  allowComments: string;
  hasComments: string;
  allowViewHistory: string;
  envelopeMetadata: EnvelopeMetadata;
  anySigner?: any;
  envelopeLocation: string;
  isDynamicEnvelope: string;
}
