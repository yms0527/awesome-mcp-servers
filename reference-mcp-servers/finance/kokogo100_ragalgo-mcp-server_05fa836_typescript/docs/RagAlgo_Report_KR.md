RagAlgo: CKN 기술의 금융 시장 적용 사례

"AI를 위한 금융 맥락 엔진 (Financial Context Engine)"
CKN 아키텍처를 실증한 최초의 Multi-Market Financial Context Provider


[ 1. 개요 ]

RagAlgo는 CKN(Contextual Knowledge Network) 아키텍처를 금융 시장 분석에 최초로 적용한 실험적 서비스입니다.

단순히 뉴스를 모아주거나 차트를 보여주는 것 뿐만 아니라, "시장의 모순을 감지하고 AI가 스스로 원인을 탐색하게 만드는" 맥락 제공 시스템입니다.

* 핵심 정체성
  - Data Provider, Not Advisor: 우리는 매수/매도 조언을 하지 않습니다.
  - Context Engine for AI: 인간이 아닌 AI 에이전트를 위한 서비스입니다.
  - Living Proof: CKN 개념이 실제 환경에서 작동함을 증명합니다.


[ 2. 왜 금융 시장인가? ]

명확한 사용자가 존재하는 금융 시장은 CKN 아키텍처를 검증하기에 가장 이상적인 테스트베드입니다.

1. 극도의 복잡성: 뉴스, 차트, 재무제표, 거시경제, 심리가 얽혀 있음
2. 실시간 모순: "실적은 좋은데 주가는 하락" 같은 상황이 매일 발생
3. 검증 가능성: 예측과 실제 주가 변동을 즉시 대조 가능


[ 3. 운영 전략: 인력의 한계를 자동화로 극복 ]

RagAlgo는 1인 개발자에 의해 운영되는 프로젝트입니다. 
물리적인 시간과 인력의 한계를 극복하고 전 세계(미국, 일본, 영국, 한국) 시장을 커버하기 위해, 우리는 "100% 자동화"를 선택했습니다.

* 24시간 잠들지 않는 인프라
  - Railway 클라우드 위에서 30개 이상의 독립적인 AI 워커(Worker)들이 유기적으로 연결되어 돌아갑니다.
  - 이 시스템은 개발자가 잠든 시간에도 각국의 데이터를 수집하고 정제하며, 24시간 공백 없는 감시 체계를 유지합니다.


[ 4. 지능: 스스로 자라나는 태그 사전 (Auto-Growing Dictionary) ]

RagAlgo는 고정된 데이터베이스가 아닙니다. 매일 진화하는 유기체입니다.

* 30,000+ 태그의 생태계
  AI는 뉴스를 읽으며 스스로 "새로운 키워드"를 찾아냅니다. 현재 30,000개 이상의 태그가 스스로 생성되었으며, 이는 정적으로 입력된 것이 아니라 AI가 시장을 관찰하며 스스로 만들어낸 결과물입니다.

* 계층적 지식 구조 (G-Series)
  - G99 (Market) → G100 (Sector) → G101 (Theme) → 개별 종목
  - AI가 "상온 초전도체" 같은 새로운 테마를 감지하면, 인간의 개입 없이 스스로 태그를 생성하고 뉴스를 분류합니다.


[ 5. 필터링: 800만 개를 12만 개로 (Signal Only) ]

월 800만 건 이상의 데이터가 쏟아지지만, 그 중 98.5%는 시장에 영향을 주지 않는 단순 노이즈입니다.
RagAlgo는 자원을 효율적으로 쓰기 위해, CKN 알고리즘을 통해 이 노이즈를 과감히 제거합니다.

* 3단계 필터링
  1. 스팸/광고 제거
  2. 단순 중복 제거
  3. 중립(0점) 노이즈 제거

결과적으로 월 12만 개의 "순도 높은 신호(High-Density Signal)"만이 AI에게 전달됩니다.


[ 6. 핵심 엔진: A와 B의 대조 (The 4-Pillar Context) ]

RagAlgo는 데이터를 단순히 나열하지 않고, **원인(A)과 결과(B)**로 나누어 판단합니다.

1. A (Context/맥락)
   - 정의: 뉴스, 재무, 테마 등 **글자(Text)**로 된 정보. ("상승의 명분")
   - 역할: "왜(Why) 움직이는가?"에 대한 이유를 제공.

2. B (Coordinate/좌표)
   - 정의: 차트상의 **위치(Zone)와 속도(Score)**. ("실제 가격의 위치")
   - 역할: A(뉴스)가 진짜인지 검증하는 **Ground Truth(진실의 기준)**.

-- AI 판단 로직: 일치 vs 모순 --

RagAlgo는 이 두 가지를 비교하여 AI가 스스로 생각하게 만듭니다.

Case 1: 일치 (Match) → "강력한 확신" (Confidence)
- 상황: A(뉴스) 긍정(+9) AND B(차트) 상승(+8)
- 판단: "명분(A)과 실제 자금 흐름(B)이 일치합니다. 신뢰할 수 있는 강한 상승 신호입니다."

Case 2: 모순 (Contradiction) → "능동적 탐색" (Why?)
- 상황: A(뉴스) 긍정(+10) BUT B(차트) 하락(-7)
- 판단: "뉴스는 좋은데 가격은 무너지고 있습니다(모순). 왜일까요?"
- 행동: AI는 스스로 질문을 던지고, 추가 정보를 검색(Self-Search)하여 숨겨진 악재를 찾기 시작합니다.


[ 7. RagAlgo의 차별점: Answer vs Trigger ]

기존 금융 터미널과 RagAlgo는 지향점이 다릅니다.

* 기존 금융 터미널 (Legacy)
  - 역할: 정답 제공자 (Answer Provider)
  - 제공물: 요리된 음식 (Cooked Meal)
  - 메시지: "이 종목이 좋습니다. 사십시오." (인간에게 결론 전달)

* RagAlgo (Next-Gen)
  - 역할: 사고 유발자 (Thinking Trigger)
  - 제공물: 신선한 재료와 레시피 (Fresh Ingredients)
  - 메시지: "뉴스는 좋은데 차트는 나쁩니다. 이상하지 않습니까?" (AI에게 질문 유발)

우리는 기존 서비스를 대체하는 것이 아니라, AI 시대에 맞는 새로운 방식의 **"생각하는 도구"**를 제공합니다.


[ 8. 연결 방식: MCP & Realtime ]

1. MCP (Model Context Protocol)
   - 방식: 요청/응답 (Pull)
   - 도구: get_tags, get_news, get_snapshot
   - 용도: Claude, ChatGPT 등이 심층 분석을 수행할 때

2. WebSocket Realtime
   - 방식: 실시간 스트리밍 (Push)
   - 주소: `wss://www.ragalgo.com/ws/v2`
   - 채널: global_news, market_snapshot
   - 용도: 0.1초의 지연도 허용하지 않는 실시간 모니터링


[ 9. 비즈니스 모델 및 참여 ]

우리는 AI 에이전트에게 가장 효율적인 맥락을 제공하는 것을 목표로 합니다.

* API 정책
  - Scored API: 0점 노이즈 자동 제거. 비용 절약형.
  - Non-Scored API: 모든 원본 제공. 연구/분석용.

* 참여 방법
  - 웹사이트: ragalgo.com 
  - 개발자: `npm install @ragalgo/mcp-server`
  - 데이터셋 다운로드: [AlgoBalloon.com](https://algoballoon.com)
  - 문의: Contact@algoballoon.com

*RagAlgo가 수집한 전 세계 원본 뉴스 데이터셋을 AlgoBalloon.com에서 다운로드를 무료로 제공합니다.
*RagAlgo.com 에서 API KEY 를 발급 받으면 계정당 무료 1000회 호출을 제공합니다. 

이 문서는 2026년 1월 1일 기준, RagAlgo 시스템의 실제 운영 데이터를 바탕으로 작성되었습니다.
