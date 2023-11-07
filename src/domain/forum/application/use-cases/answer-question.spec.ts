import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'

let fakeAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Answer question', () => {
  beforeEach(() => {
    fakeAnswersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(fakeAnswersRepository)
  })

  it('should be able to answer a question', async () => {
    const result = await sut.execute({
      questionId: '1',
      instructorId: '1',
      content: 'Nova resposta',
    })

    expect(result.isRigth()).toBe(true)
    expect(fakeAnswersRepository.items[0]).toEqual(result.value?.answer)
  })
})
