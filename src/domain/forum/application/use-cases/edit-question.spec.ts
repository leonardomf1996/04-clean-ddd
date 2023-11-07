import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditQuestionUseCase } from './edit-question'

let fakeQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit question', () => {
  beforeEach(() => {
    fakeQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(fakeQuestionsRepository)
  })

  it.skip('should be able to edit a question', async () => {
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
      title: 'new-title',
      content: 'new-content',
      questionId: 'question-1',
    })

    expect(fakeQuestionsRepository.items[0]).toMatchObject({
      title: 'new-title',
      content: 'new-content',
    })
  })

  it('should not be able to edit a question from another user', async () => {
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
        title: 'new-title',
        content: 'new-content',
        questionId: 'question-1',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
