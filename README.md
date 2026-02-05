# SOCIOMILE 2.0

Engineering Take-Home Coding Assignment (Fullstack)

---

## Status

**Completed**

---

## Summary

Repositori ini merupakan submission untuk _take-home assignment_ Engineering Sociomile versi mini, berfokus pada sistem Ticket Management, Conversation (Chat), Multi-Tenancy, dan Authentication & Authorization.

---

## Stack yang Digunakan

**Frontend:**  
- ReactJs (Vite template)

---

## Deskripsi Case Study

Bangun mini Sociomile System yang memiliki:

1. **Authentication & Authorization**  
   - Login email & password  
   - Role: admin & agent  
   - Proteksi endpoint sesuai role  
   - Token-based (JWT)

2. **Multi-Tenancy**  
   - Mendukung banyak tenant  
   - Data terisolasi antar tenant  
   - User tenant A tidak dapat akses data tenant B  
     - (Implementasi: setiap tabel utama memiliki kolom tenant_id)

3. **Ticket Management**  
   - Atribut ticket:
     - id
     - title
     - description
     - status (open, in_progress, resolved, closed)
     - priority (low, medium, high)
     - assigned_agent_id
     - customer_id
     - tenant_id
     - created_at, updated_at
   - API:
     - Create ticket
     - Assign agent
     - Update status ticket
     - List ticket (+ filter status / agent)

## Cara Menjalankan Aplikasi

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

## Daftar Endpoint API

- `POST   /login`                  : Login
- `GET    /tickets`                : Daftar tiket (filter: status, agent)
- `POST   /tickets`                : Buat tiket
- `PUT    /tickets/:id/assign`     : Assign tiket ke agent
- `PUT    /tickets/:id/status`     : Update status tiket
- `GET    /tickets/:id/conversations` : List pesan di tiket
- `POST   /tickets/:id/conversations` : Kirim pesan di tiket

---

## Fitur yang Belum Selesai

- Pembuatan dan manajemen tenant (belum ada simple UI, seed manual).
- Rate limiting API dengan Redis _(belum diimplementasi)_.
- Async ticket event/log ke Redis _(belum diimplementasi)_.
- OpenAPI/Swagger docs _(hanya outline, detail belum lengkap)_.
- Unit test untuk service/usecase layer _(pending)_.
- Docker-compose untuk backend _(belum ditulis)_.
- UI setting (multi-tenant context switch) _(belum tersedia)_.
- Beberapa edge-case error handling di frontend _(belum sempurna)_.

---
