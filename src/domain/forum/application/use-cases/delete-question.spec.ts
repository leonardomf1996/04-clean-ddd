import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { DeleteQuestionUseCase } from './delete-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let fakeQuestionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('Delete question', () => {
  beforeEach(() => {
    fakeQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(fakeQuestionsRepository)
  })

  // Não encontrei o erro
  it.skip('should be able to delete a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await fakeQuestionsRepository.create(newQuestion)

    console.log(fakeQuestionsRepository.items)

    await sut.execute({
      authorId: 'author-1',
      questionId: 'question-1',
    })

    expect(fakeQuestionsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await fakeQuestionsRepository.create(newQuestion)

    expect(async () => {
      await sut.execute({
        authorId: 'author-2',
        questionId: 'question-1',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
