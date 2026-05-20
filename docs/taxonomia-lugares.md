# Taxonomia de lugares — subcategorias vs tags

## Regra

| Camada | O que é | Exemplo (Natureza) |
|--------|---------|-------------------|
| **Categoria** | Grupo fixo no app | Natureza |
| **Subcategoria** | **Tipo** do lugar (filtro na página da categoria) | Praias, Trilhas, Cachoeiras |
| **Tags** (máx. 3) | **Atributos** e experiência | Surfe, Pôr do sol imperdível, Mar agitado |

Não crie subcategoria para coisas que já são tag (Surfe, pôr do sol, mergulho, romântico, pet friendly, etc.).

## Subcategorias canônicas

Definidas em `supabase/taxonomia_lugares_cleanup.sql`.

### Natureza
Praias · Trilhas · Cachoeiras · Mirantes · Lagoas · Parques · Piscinas naturais · Dunas · Ilhas

### Gastronomia
Restaurantes · Cafés · Bares · Padarias · Sorveterias

### Noite
Bares · Baladas · Pubs

### Serviços
Farmácias · Mercados · Mecânicos · Salões · Saúde

### Hospedagem
Pousadas · Hostels · Hotéis

### Cultura
Museus · Monumentos · Igrejas e templos · Eventos

### Aventura
Esportes radicais · Passeios de barco · Escalada · Ciclismo

### Bem-estar
Spa · Yoga · Terapias

### Compras
Lojas · Feiras · Artesanato

## Tags novas (detalhes)

Incluídas no mesmo SQL, entre outras: **Surfe**, Stand-up paddle, Bodyboard, Costão, Praia paradisíaca, Frutos do mar, Happy hour, Patrimônio histórico, etc.

Tags que já existiam e cobrem o caso: **Pôr do sol imperdível**, **Nascer do sol**, **Ótimo para mergulho**, **Vista para o mar**, **Mar agitado** / **Mar calmo**.

## Cadastro no admin

1. Categoria → ex. Natureza  
2. Subcategoria → ex. **Praias** (não “Surf”)  
3. Tags → ex. **Surfe** + **Pôr do sol imperdível** + **Mar agitado**

## Aplicar no Supabase

Rode `supabase/taxonomia_lugares_cleanup.sql` no SQL Editor (idempotente).
