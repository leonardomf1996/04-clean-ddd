import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

let fakeQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create question', () => {
  beforeEach(() => {
    fakeQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(fakeQuestionsRepository)
  })

  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: 'valid-id',
      title: 'valid-title',
      content: 'valid-content',
    })

    expect(result.isRigth()).toBe(true)
    expect(fakeQuestionsRepository.items[0]).toEqual(result.value?.question)
  })
})
