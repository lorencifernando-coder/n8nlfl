# Plano de Crescimento Digital 2026 — Dr. Luiz Fernando Lorenci

Operacionalização do Projeto Técnico de Branding e Aquisição Digital, conectado à landing page e ao sistema de métricas já implementado.

---

## 1. Fundação de marca (implementada na landing page)

| Diretriz do brand book | Status na página |
|---|---|
| Paleta 60-30-10: Bege Linho `#F4F0EA` / Azul Noturno `#1E2B38` / Terracota `#C67A5C` | ✅ Aplicada em todo o CSS via variáveis |
| Tipografia: Playfair Display (títulos) + Inter (corpo, mín. 16px mobile) | ✅ Google Fonts com fallback Georgia/Arial |
| Cantos arredondados em toda a interface | ✅ Cards, botões e inputs com border-radius |
| Tom de voz calmo, empoderador e validador | ✅ Copy do roteiro de conversão aplicada |
| Hero: "Vença o esgotamento crônico e recupere sua vitalidade" | ✅ Título + subtítulo do roteiro |
| Garantia: "Compromisso de Escuta Ativa" (estorno em 20 min) | ✅ Seção dedicada |

**Pendências de produção (dependem do Dr. Luiz):**
- [ ] Vídeo acolhedor de 90s no consultório para o hero (roteiro: quebrar a frieza do digital, luz natural, tom pausado)
- [ ] Fotos com luz natural, madeira/plantas, camisa azul ou bege (sem jaleco pesado, sem fundo de estúdio) → salvar como `img/dr-lorenci.jpg` e `img/dr-lorenci-consulta.jpg`

---

## 2. Google Ads — Playbook de lançamento

### 2.1 Campanha de Pesquisa (correspondência de frase)

Colar exatamente estas keywords:

```
"medico para burnout"
"tratamento para burnout"
"especialista em burnout"
"medico esgotamento mental"
"tratamento exaustao cronica"
"medico estresse cronico"
"consulta burnout online"
"como tratar esgotamento profissional"
"medico saude mental burnout"
"clinica especialista em burnout"
"tratamento para estresse de exaustao"
"Dr Luiz Fernando Lorenci"
```

**Negativações recomendadas** (economizam verba desde o dia 1):
`gratuito, gratis, sus, pelo sus, sintomas, teste, o que é, significado, cid, inss, afastamento, atestado, vagas, emprego, curso`

### 2.2 Copy dos anúncios

- **Títulos (30 car.):** Vença a Exaustão Mental · Tratamento de Burnout · Recupere Sua Vitalidade · Atendimento Sem Pressa
- **Descrição curta (60 car.):** Recupere a energia e vença o burnout com ajuda médica.
- **Descrições longas (90 car.):**
  - Promover saúde e cuidar da mente não é luxo, é essencial. Agende sua consulta médica.
  - Cansado de se sentir sem energia nas horas mais decisivas? Agende sua consulta médica.
  - Desmotivação, sono ruim e exaustão crônica não são pesos para você carregar sozinho.
- **Frases de destaque (25 car.):** Atendimento Sem Pressa | Abordagem Integral | Foco em Burnout | Medicina Humanizada | Emissão de Reembolso
- **Sitelinks:** Marcar Consulta Agora · Tratamento de Burnout · Conheça o Dr. Luiz · Reembolso de Convênio

### 2.3 Segmentação

- **Idade:** 25-34, 35-44, 45-54
- **Renda familiar:** top 10%, 11-20%, 21-30%
- **Segmento por intenção customizado:** URLs de Exame Carreira, Valor Econômico, Harvard Business Review

### 2.4 Orçamento e lances

| Fase | Orçamento | Estratégia de lance | Gatilho de mudança |
|---|---|---|---|
| Aprendizado (dias 1-30) | R$ 50/dia (~11 cliques, CPC ~R$ 4,50) | Maximizar Cliques, teto R$ 6,00 | 20-30 conversões registradas |
| Escala | R$ 100/dia (~22 cliques, ~1 lead/dia) | Maximizar Conversões | CPA estável por 2 semanas |

**Matemática do funil (base para decisão):**
- R$ 100/dia → ~660 cliques/mês → a 4-6% de conversão → 26-40 leads/mês
- Consulta R$ 350 → 26 consultas cobrem ~R$ 3.000 de mídia com ROAS ≈ 3x
- **CPA máximo saudável: R$ 115** (1/3 do ticket). Acima disso, revisar termos de pesquisa e anúncios.

---

## 3. Medição (já embutida na landing page)

A página envia automaticamente ao GA4 e ao Google Ads (configuráveis no painel admin — ícone de chave):

| Evento | Disparo | Uso |
|---|---|---|
| `cta_click` | Qualquer botão Agendar | Otimização de posição/copy dos CTAs |
| `generate_lead` | Visitante chega à seção de preço | Lead qualificado (métrica primária) |
| `begin_checkout` | CTA final, investimento ou WhatsApp | **Importar como conversão no Google Ads** |
| `checklist_engaged` | 2+ sinais marcados | Qualificação de audiência p/ remarketing |
| `scroll_depth` | 25/50/75/100% | Diagnóstico de fricção na página |

**Setup em 3 passos:**
1. Criar propriedade GA4 → colar o Measurement ID (G-…) no painel admin
2. No Google Ads, criar ação de conversão → colar Conversion ID (AW-…) e Label no painel admin
3. Vincular GA4 ↔ Google Ads e importar `begin_checkout` como conversão principal

UTMs (`utm_source`, `utm_campaign`, `gclid` etc.) são capturados automaticamente e exibidos na aba Métricas do admin.

**Padrão de UTM para as campanhas:**
`?utm_source=google&utm_medium=cpc&utm_campaign=burnout-pesquisa&utm_term={keyword}`

---

## 4. Roadmap de crescimento além do Ads

### Fase 1 — Validação (meses 1-2)
- Rodar a campanha de pesquisa com a landing page atual
- Meta: 20-30 conversões para sair do aprendizado; CPA < R$ 115
- Revisar semanalmente o relatório de termos de pesquisa (negativar lixo)

### Fase 2 — Otimização (meses 2-4)
- Teste A/B de hero via painel admin (título/subtítulo são editáveis sem deploy)
- Gravar o vídeo de 90s → historicamente +20-40% em conversão de LPs de saúde
- Remarketing (Display/YouTube) para quem disparou `checklist_engaged` mas não converteu — audiência morna e barata

### Fase 3 — Autoridade orgânica (meses 3-6)
- Google Business Profile otimizado (Florianópolis + telemedicina) — tráfego gratuito de "Dr Luiz Fernando Lorenci"
- 2 artigos/mês no site oficial sobre as keywords do playbook (esgotamento profissional, estresse crônico) — reduz dependência de mídia paga
- Pedir avaliações Google aos pacientes concluídos (prova social que alimenta o Ads)

### Fase 4 — Retenção e LTV (meses 4+)
- Sequência de e-mail pós-consulta (acompanhamento = recorrência)
- Pacotes de acompanhamento trimestral (eleva LTV e previsibilidade de agenda)
- Indicação estruturada: paciente recuperado é o melhor canal de aquisição em saúde mental

---

## 5. Conformidade CFM (checklist permanente)

- ✅ Depoimentos focados em experiência e qualidade de vida (sem promessa de cura)
- ✅ Disclaimer no rodapé: caráter informativo, resultados individuais variam
- ✅ CRM visível em todas as seções de identificação
- ⚠️ Nunca usar em anúncios: "cura", "garantia de resultado", antes/depois, superlativos ("o melhor médico")
