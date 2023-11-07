import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditAnswerUseCase } from './edit-answer'

let fakeAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit answer', () => {
  beforeEach(() => {
    fakeAnswersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(fakeAnswersRepository)
  })

  it.skip('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await fakeAnswersRepository.create(newAnswer)

    console.log(fakeAnswersRepository.items)

    await sut.execute({
      authorId: 'author-1',
      content: 'new-content',
      answerId: 'answer-1',
    })

    expect(fakeAnswersRepository.items[0]).toMatchObject({
      title: 'new-title',
      content: 'new-content',
    })
  })

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await fakeAnswersRepository.create(newAnswer)

    expect(async () => {
      await sut.execute({
        authorId: 'author-2',
        content: 'new-content',
        answerId: 'answer-1',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
