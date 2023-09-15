# express-mongoDB-TODO
express와 mongoDB를 사용해 TODO CRUD에 필요한 API를 구현합니다.

### REST API
- REST한 API
  - API: Application Programming Interface
    - 서버와 클라이언트 간의 요청 방식 (규약)
  - REST: Representational State Transfer
    - **Uniform interface**
      - 하나의 URL이 하나의 자료를 나타냄
      - URL이 예측 가능해야 함 (일정한 규칙을 따라야 함)
      - 요청과 응답에 충분한 정보가 들어있어야 함
    - Client(요청) - Server(응답) 역할 구분
    - Stateless
      - 클라이언트의 정보를 기억하지 않음
      - 각 요청 사이에 의존성이 없어야 함
    - Cacheable
      - 캐싱을 지원해야 함
    - Layered system
    - Code on demand