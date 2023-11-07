import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'

let fakeQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get question by slug', () => {
  beforeEach(() => {
    fakeQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(fakeQuestionsRepository)
  })

  it('should be able to get an question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('valid-title'),
    })

    await fakeQuestionsRepository.create(newQuestion)

    const { question } = await sut.execute({
      slug: 'valid-title',
    })

    expect(question.getId).toBeTruthy()
    expect(question.title).toEqual(newQuestion.title)
  })
})
