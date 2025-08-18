// Types and Interfaces
export interface SubscriptionPlan {
  id: "freemium" | "premium-monthly" | "premium-annual";
  name: string;
  description: string;
  features: string[];
  badge?: string;
}

export interface AddressDetails {
  street: string;
  houseNumber: string;
  additional: string;
  postalCode: string;
  city: string;
  country: string;
  houseNumberAddition?: string;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface Profile {
  id: string;
  documentId: string;
  firstName: string;
  lastName: string;
  businessName: string;
  businessAddress: string;
  phoneNo: string;
  kvkNo: string;
  email: string;
  gender: string;
  religion: string;
  description: string;
  waitingTime: number;
  stripeSubscriptionId: string;
  premiumsExpiresAt: string;
  billingCycle: string;
  isPremium?: boolean;
  cancelAtPeriodEnd?: boolean;
  isWishlisted?: boolean;
  priceId?: string;
  profilePhoto?: {
    id: number;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: any;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: any;
    createdAt: string;
    updatedAt: string;
  };
  specialities: string[];
  languages: string[];
  culturalBackground: string[];
  treatmentMethods: string[];
  focusAreas: string[];
  consultationTypes: string[];
  sessionFormats: string[];
  ageGroups: string[];
  providerType: string[];
  bookingUrl: string;
  latitude: number;
  longitude: number;
  businessCoordinates: {
    lat: number;
    lng: number;
  };
}

// Data Arrays
export const ethnicities = [
  "Zwart/Afrikaans",
  "Aziatisch",
  "Kaukasisch",
  "Latijns",
  "Midden-Oosters",
  "Multiraciaal",
].sort();

export const getProviderTypesData = (t: any) => {
  return {
    "Individual Providers": [
      {
        label: t("ProviderTypes.psychiatrist"),
        value: "psychiatrist",
      },
      {
        label: t("ProviderTypes.psychologist"),
        value: "psychologist",
      },
      {
        label: t("ProviderTypes.coach"),
        value: "coach",
      },
      {
        label: t("ProviderTypes.therapist"),
        value: "therapist",
      },
      {
        label: t("ProviderTypes.alternative-therapist"),
        value: "alternative-therapist",
      },
    ],
    "Healthcare Organizations": [
      {
        label: t("ProviderTypes.mental-health-clinic"),
        value: "mental-health-clinic",
      },
      {
        label: t("ProviderTypes.psychiatric-hospital"),
        value: "psychiatric-hospital",
      },
      {
        label: t("ProviderTypes.rehabilitation-center"),
        value: "rehabilitation-center",
      },
      {
        label: t("ProviderTypes.group-practice"),
        value: "group-practice",
      },
      {
        label: t("ProviderTypes.telehealth-service"),
        value: "telehealth-service",
      },
      {
        label: t("ProviderTypes.community-mental-health-center"),
        value: "community-mental-health-center",
      },
    ],
  };
};

export const getTagsData = (t: any) => {
  return [
    {
      label: t("Tags.mental-health"),
      value: "mental-health",
    },
    {
      label: t("Tags.self-care"),
      value: "self-care",
    },
    {
      label: t("Tags.wellness"),
      value: "wellness",
    },
    {
      label: t("Tags.mindfulness"),
      value: "mindfulness",
    },
    {
      label: t("Tags.stress-management"),
      value: "stress-management",
    },
    {
      label: t("Tags.emotional-health"),
      value: "emotional-health",
    },
    {
      label: t("Tags.personal-growth"),
      value: "personal-growth",
    },
    {
      label: t("Tags.healing"),
      value: "healing",
    },
    {
      label: t("Tags.recovery"),
      value: "recovery",
    },
    {
      label: t("Tags.resilience"),
      value: "resilience",
    },
    {
      label: t("Tags.anxiety"),
      value: "anxiety",
    },
    {
      label: t("Tags.depression"),
      value: "depression",
    },
    {
      label: t("Tags.trauma"),
      value: "trauma",
    },
    {
      label: t("Tags.grief"),
      value: "grief",
    },
    {
      label: t("Tags.relationships"),
      value: "relationships",
    },
    {
      label: t("Tags.family"),
      value: "family",
    },
    {
      label: t("Tags.work-life-balance"),
      value: "work-life-balance",
    },
    {
      label: t("Tags.sleep"),
      value: "sleep",
    },
    {
      label: t("Tags.boundaries"),
      value: "boundaries",
    },
    {
      label: t("Tags.communication"),
      value: "communication",
    },
    {
      label: t("Tags.confidence"),
      value: "confidence",
    },
    {
      label: t("Tags.body-image"),
      value: "body-image",
    },
    {
      label: t("Tags.addiction"),
      value: "addiction",
    },
    {
      label: t("Tags.anger-management"),
      value: "anger-management",
    },
    {
      label: t("Tags.therapy-tips"),
      value: "therapy-tips",
    },
    {
      label: t("Tags.coping-strategies"),
      value: "coping-strategies",
    },
    {
      label: t("Tags.therapeutic-techniques"),
      value: "therapeutic-techniques",
    },
    {
      label: t("Tags.finding-a-therapist"),
      value: "finding-a-therapist",
    },
    {
      label: t("Tags.therapy-myths"),
      value: "therapy-myths",
    },
    {
      label: t("Tags.treatment-options"),
      value: "treatment-options",
    },
    {
      label: t("Tags.medication"),
      value: "medication",
    },
    {
      label: t("Tags.alternative-healing"),
      value: "alternative-healing",
    },
    {
      label: t("Tags.cultural-identity"),
      value: "cultural-identity",
    },
    {
      label: t("Tags.immigration"),
      value: "immigration",
    },
    {
      label: t("Tags.multicultural"),
      value: "multicultural",
    },
    {
      label: t("Tags.identity"),
      value: "identity",
    },
    {
      label: t("Tags.community"),
      value: "community",
    },
    {
      label: t("Tags.belonging"),
      value: "belonging",
    },
    {
      label: t("Tags.discrimination"),
      value: "discrimination",
    },
    {
      label: t("Tags.bias"),
      value: "bias",
    },
    {
      label: t("Tags.daily-habits"),
      value: "daily-habits",
    },
    {
      label: t("Tags.exercise"),
      value: "exercise",
    },
    {
      label: t("Tags.nutrition"),
      value: "nutrition",
    },
    {
      label: t("Tags.social-connection"),
      value: "social-connection",
    },
    {
      label: t("Tags.financial-stress"),
      value: "financial-stress",
    },
    {
      label: t("Tags.parenting"),
      value: "parenting",
    },
    {
      label: t("Tags.career"),
      value: "career",
    },
    {
      label: t("Tags.education"),
      value: "education",
    },
    {
      label: t("Tags.technology"),
      value: "technology",
    },
    {
      label: t("Tags.social-media"),
      value: "social-media",
    },
  ];
};

export const backgrounds = [
  "Dutch",
  "Turkish",
  "Moroccan",
  "Surinamese",
  "Indonesian",
  "German",
  "British",
  "Polish",
  "Romanian",
  "Bulgarian",
  "Spanish",
  "Italian",
  "Greek",
  "Chinese",
  "Japanese",
  "Korean",
  "Indian",
  "Pakistani",
  "Iranian",
  "Iraqi",
  "Syrian",
  "Lebanese",
  "Egyptian",
  "Nigerian",
  "Ghanaian",
  "South African",
  "Brazilian",
  "Colombian",
  "Mexican",
  "American",
  "Canadian",
  "Australian",
].sort();

export const languages = [
  "Dutch",
  "English",
  "German",
  "Turkish",
  "Arabic",
  "Polish",
  "Spanish",
  "Portuguese",
  "French",
  "Chinese",
  "Hindi",
  "Urdu",
  "Indonesian",
  "Japanese",
  "Korean",
  "Russian",
  "Italian",
  "Greek",
  "Vietnamese",
  "Thai",
  "Bengali",
  "Persian",
  "Kurdish",
  "Romanian",
  "Bulgarian",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
].sort();

export const getConsultationTypesData = (t: any) => {
  return [
    {
      label: t("Common.in-person"),
      value: "in-person",
    },
    {
      label: t("Common.online"),
      value: "online",
    },
    {
      label: t("Common.hybrid"),
      value: "hybrid",
    },
    {
      label: t("Common.home-visits"),
      value: "home-visits",
    },
  ].sort();
};

export const RELIGION_DATA = [
  "Agnostic",
  "Atheist",
  "Baha'i",
  "Buddhism",
  "Christianity",
  "Hinduism",
  "Islam",
  "Jainism",
  "Judaism",
  "Paganism",
  "Sikhism",
  "Spiritual but not religious",
  "Zoroastrianism",
  "Other",
  "Prefer not to say",
].sort();

export const availability = [
  "Morning",
  "Afternoon",
  "Evening",
  "Weekends",
  "Immediate",
  "Flexible",
].sort();

export const getTreatmentMethodsData = (t: any) => {
  return [
    {
      label: t("TreatmentMethods.cgt"),
      value: "cgt",
    },
    {
      label: t("TreatmentMethods.emdr"),
      value: "emdr",
    },
    {
      label: t("TreatmentMethods.mindfulness"),
      value: "mindfulness",
    },
    {
      label: t("TreatmentMethods.adhd-coaching"),
      value: "adhd-coaching",
    },
    {
      label: t("TreatmentMethods.stress-coaching"),
      value: "stress-coaching",
    },
    {
      label: t("TreatmentMethods.integratieve-therapie"),
      value: "integratieve-therapie",
    },
    {
      label: t("TreatmentMethods.reiki"),
      value: "reiki",
    },
    {
      label: t("TreatmentMethods.aromatherapie"),
      value: "aromatherapie",
    },
    {
      label: t("TreatmentMethods.systeemtherapie"),
      value: "systeemtherapie",
    },
    {
      label: t("TreatmentMethods.relatie-en-gezinstherapie"),
      value: "relatie-en-gezinstherapie",
    },
    {
      label: t("TreatmentMethods.psychodynamische-therapie"),
      value: "psychodynamische-therapie",
    },
    {
      label: t("TreatmentMethods.oplossingsgerichte-therapie"),
      value: "oplossingsgerichte-therapie",
    },
    {
      label: t("TreatmentMethods.cognitieve-gedragstherapie"),
      value: "cognitieve-gedragstherapie",
    },
    {
      label: t("TreatmentMethods.osteopathie"),
      value: "osteopathie",
    },
    {
      label: t("TreatmentMethods.shiatsu"),
      value: "shiatsu",
    },
    {
      label: t("TreatmentMethods.hypnotherapie"),
      value: "hypnotherapie",
    },
    {
      label: t("TreatmentMethods.autismecoaching"),
      value: "autismecoaching",
    },
    {
      label: t("TreatmentMethods.energetische-therapie"),
      value: "energetische-therapie",
    },
    {
      label: t("TreatmentMethods.klankschaaltherapie"),
      value: "klankschaaltherapie",
    },
    {
      label: t("TreatmentMethods.executive-coaching"),
      value: "executive-coaching",
    },
    {
      label: t("TreatmentMethods.acceptance-and-commitment-therapy"),
      value: "acceptance-and-commitment-therapy",
    },
  ].sort();
};

export const getAgeGroupsData = (t: any) => {
  return [
    {
      label: t("AgeGroups.children"),
      value: "children",
    },
    {
      label: t("AgeGroups.adolescents"),
      value: "adolescents",
    },
    {
      label: t("AgeGroups.young-adults"),
      value: "young-adults",
    },
    {
      label: t("AgeGroups.adults"),
      value: "adults",
    },
    {
      label: t("AgeGroups.elderly"),
      value: "elderly",
    },
  ].sort();
};

export const getSessionFormatsData = (t: any) => {
  return [
    {
      label: t("SessionFormats.individual-therapy"),
      value: "individual-therapy",
    },
    {
      label: t("SessionFormats.support-groups"),
      value: "support-groups",
    },
    {
      label: t("SessionFormats.crisis-intervention"),
      value: "crisis-intervention",
    },
    {
      label: t("SessionFormats.family-therapy"),
      value: "family-therapy",
    },
    {
      label: t("SessionFormats.couple-therapy"),
      value: "couple-therapy",
    },
    {
      label: t("SessionFormats.group-therapy"),
      value: "group-therapy",
    },
  ].sort();
};

export const getFocusAreasData = (t: any) => {
  return [
    {
      label: t("FocusAreas.life-transitions"),
      value: "life-transitions",
    },
    {
      label: t("FocusAreas.relationship-issues"),
      value: "relationship-issues",
    },
    {
      label: t("FocusAreas.work-related-stress"),
      value: "work-related-stress",
    },
    {
      label: t("FocusAreas.identity-issues"),
      value: "identity-issues",
    },
    {
      label: t("FocusAreas.cross-cultural-challenges"),
      value: "cross-cultural-challenges",
    },
    {
      label: t("FocusAreas.immigration-expatriate-experience"),
      value: "immigration-expatriate-experience",
    },
    {
      label: t("FocusAreas.burnout"),
      value: "burnout",
    },
    {
      label: t("FocusAreas.addiction-recovery"),
      value: "addiction-recovery",
    },
    {
      label: t("FocusAreas.lgbtq-specific"),
      value: "lgbtq-specific",
    },
    {
      label: t("FocusAreas.trauma-recovery"),
      value: "trauma-recovery",
    },
    {
      label: t("FocusAreas.grief-and-loss"),
      value: "grief-and-loss",
    },
    {
      label: t("FocusAreas.domestic-violence"),
      value: "domestic-violence",
    },
    {
      label: t("FocusAreas.sexual-abuse"),
      value: "sexual-abuse",
    },
    {
      label: t("FocusAreas.chronic-pain"),
      value: "chronic-pain",
    },
    {
      label: t("FocusAreas.learning-disabilities"),
      value: "learning-disabilities",
    },
    {
      label: t("FocusAreas.behavioral-issues"),
      value: "behavioral-issues",
    },
  ].sort();
};

export const insuranceProviders = [
  "CZ",
  "VGZ",
  "Zilveren Kruis",
  "Menzis",
  "ONVZ",
  "DSW",
  "ASR",
  "OHRA",
  "IZZ",
  "IZA",
  "Univé",
  "De Friesland",
].sort();

export const defaultProfile: Profile = {
  id: "",
  documentId: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNo: "",
  businessAddress: "",
  businessName: "",
  kvkNo: "",
  gender: "",
  religion: "",
  description: "",
  stripeSubscriptionId: "",
  premiumsExpiresAt: "",
  billingCycle: "",
  waitingTime: 0,
  specialities: [],
  languages: [],
  culturalBackground: [],
  treatmentMethods: [],
  focusAreas: [],
  consultationTypes: [],
  sessionFormats: [],
  ageGroups: [],
  providerType: [],
  bookingUrl: "",
  latitude: 0,
  longitude: 0,
  businessCoordinates: {
    lat: 0,
    lng: 0,
  },
};
