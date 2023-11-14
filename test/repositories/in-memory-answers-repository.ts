import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async findById(id: string): Promise<Answer | null> {
    const idUnique = new UniqueEntityID(id)
    const answer = this.items.find((item) => item.getId() === idUnique)

    if (!answer) return null

    return answer
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }

  async create(answer: Answer): Promise<void> {
    this.items.push(answer)

    DomainEvents.dispatchEventsForAggregate(answer.getId())
  }

  async save(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.getId() === answer.getId(),
    )

    this.items[itemIndex] = answer

    DomainEvents.dispatchEventsForAggregate(answer.getId())
  }

  async delete(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.getId() === answer.getId(),
    )
    this.items.splice(itemIndex, 1)
    this.answerAttachmentsRepository.deleteManyByAnswerId(
      String(answer.getId()),
    )
  }
}
