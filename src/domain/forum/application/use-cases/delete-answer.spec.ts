import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { DeleteAnswerUseCase } from './delete-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'

let fakeAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete answer', () => {
  beforeEach(() => {
    fakeAnswersRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(fakeAnswersRepository)
  })

  it.skip('should be able to delete a answer', async () => {
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
      answerId: 'answer-1',
    })

    console.log(fakeAnswersRepository.items)

    expect(fakeAnswersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )

    await fakeAnswersRepository.create(newAnswer)

    expect(async () => {
      return sut.execute({
        authorId: 'author-2',
        answerId: 'answer-1',
      })
    }).rejects.toBeInstanceOf(NotAllowedError)
  })
})
