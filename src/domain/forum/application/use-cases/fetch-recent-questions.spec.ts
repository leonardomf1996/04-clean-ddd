import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let fakeQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch recent questions', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    fakeQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new FetchRecentQuestionsUseCase(fakeQuestionsRepository)
  })

  it.skip('should be able to fetch recent questions', async () => {
    await fakeQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2023, 0, 20) }),
    )
    await fakeQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2023, 0, 18) }),
    )
    await fakeQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2023, 0, 23) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result).toHaveLength(3)
    expect(result).toEqual([
      expect.objectContaining({ createdAt: new Date(2023, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2023, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2023, 0, 18) }),
    ])
  })

  it.skip('should be able to fetch paginated recent questions', async () => {
    for (let i = 0; i < 27; i += 1) {
      await fakeQuestionsRepository.create(makeQuestion())
    }

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value).toHaveLength(20)
  })
})
