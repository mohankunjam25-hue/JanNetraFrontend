# JanNetra API Integration Strategy Guide

JanNetra ko ek professional, hyperscale governance platform banane ke liye humein reliable aur official data sources ki zaroorat hai. Niche diye gaye APIs aur data sources JanNetra ke core features ko power karenge.

---

## 1. Administrative Hierarchy (States, Districts, Villages)
**Kyun zaroori hai?** User signup aur "My Area" dashboard ke liye India ka poora geographic data (6 Lakh+ Villages) chahiye.

*   **Primary Source:** [Open Government Data (OGD) Platform India](https://data.gov.in/)
    *   **Data set:** Local Government Directory (LGD).
    *   **Kaise milega?** data.gov.in par register karke "LGD" search karein. Wahan se aapko JSON/CSV format mein poori hierarchy mil jayegi.
*   **Alternative:** [LGD Directory Portal](https://lgdirectory.gov.in/) (For manual verification).

---

## 2. Leadership & Election Data (PM, CM, MP, MLA)
**Kyun zaroori hai?** "My Leaders" section mein sahi contact info aur verified status dikhane ke liye.

*   **Parliament (MPs):** [Sansad.in - Digital Sansad API](https://sansad.in/)
    *   Yahan se aapko Member of Parliament ki list aur unki constituency ka data milta hai.
*   **Assemblies (MLAs):** State Election Commission APIs.
    *   Harr state (e.g., MP, Jharkhand) ki apni legislative assembly website hoti hai jahan se list fetch ki jati hai.
*   **Cabinet Ministers:** [PIB (Press Information Bureau)](https://pib.gov.in/)
    *   Official central updates aur minister profiles ke liye.

---

## 3. Government Schemes (Central & State)
**Kyun zaroori hai?** "Schemes For You" feature ke liye harr scheme ki eligibility aur benefits ka data chahiye.

*   **Primary Source:** [myScheme API](https://www.myscheme.gov.in/)
    *   Yeh India ka official portal hai jo harr citizen-centric scheme ko track karta hai.
    *   **Kaise milega?** myScheme ke "Developer" section mein jakar access request ki ja sakti hai.
*   **National Government Services Portal:** [Services.india.gov.in](https://services.india.gov.in/)

---

## 4. Real-time Governance News & Updates
**Kyun zaroori hai?** Home Feed ke "Latest Updates" section ke liye verified government news chahiye taaki "Fake News" na faile.

*   **PIB News Feed:** Press Information Bureau RSS/API.
    *   **Kyun?** Kyunki ye sabse zyada trusted aur official news source hai India ka.
*   **NewsAPI (India Filter):** [newsapi.org](https://newsapi.org/)
    *   Yahan se aap `category=politics` aur `country=in` karke wide-scale news le sakte hain.

---

## 5. Maps & Geocoding
**Kyun zaroori hai?** User ki location automatically detect karne aur administrative mapping ke liye.

*   **Mapbox / OpenStreetMap:** [Mapbox API](https://www.mapbox.com/)
    *   **Kyun?** Google Maps se sasta aur zyada customizable hai hyperscale ke liye.
*   **IP-API (For Auto-Location):** [ip-api.com](https://ip-api.com/)
    *   User jab website kholta hai, toh uska State/City guess karne ke liye iska use hota hai bina GPS permission liye.

---

## 6. Social Engagement (Optional but Recommended)
*   **Firebase / Supabase (Real-time DB):** Community posts aur chat features ke liye real-time database use hoga taaki 5B users ka interaction fast rahe.

---

### **Important Notes for Hyperscale (5B Users):**

1.  **Data Caching:** Hum direct APIs ko har baar call nahi karenge. Hum data ko pehle apne **MongoDB** mein store (Cache) karenge aur user ko wahan se dikhayenge. Isse APIs ki "Rate Limit" hit nahi hogi.
2.  **No API Keys in Frontend:** Kabhi bhi upar diye gaye APIs ki keys `.env` file ke bina use na karein. Frontend se keys expose ho jati hain, isliye hamesha **Backend Proxy** use karein.
3.  **Accuracy:** Governance platform mein data ki accuracy sabse zaroori hai. Hamesha `.gov.in` sources ko priority den.

---
*Document Created on: June 12, 2026*
