import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { Topics} from '../../models/topics.model';
import { Topic } from '../../models/topic.model';
import { TopicTerm } from '../../models/topic-term.model';
import {AnswerVariant} from '../../models/answer-variant.model';

@Component({
  selector: '[appTopicTestTerm]', // tslint:disable-line
  templateUrl: './topic-test-term.component.html',
  styleUrls: ['./topic-test-term.component.scss']
})
export class TopicTestTermComponent {
  @Input()
  term: TopicTerm;

  get answers(): AnswerVariant[] {
    return this.term.topic.answers;
  }
}

@Component({
  selector: 'app-topic-test',
  templateUrl: './topic-test.component.html',
  styleUrls: ['./topic-test.component.scss']
})
export class TopicTestComponent implements OnInit {
  topicSearch: Topics = new Topics();
  topic: Topic;
  nextTopic: Topic; // следующий выбранный топик
  prevTopic: Topic; // предыдущий выбранный топик
  loaded: Boolean = false;
  loading: Boolean = false;

  constructor(private questionnaire: QuestionnaireService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.loadTopics();
  }

  // загрузить топик
  loadTopics(): void {
    this.loaded = false;
    this.loading = true;

    this.questionnaire.topics()
      .subscribe(
        this.onLoadTopicsSuccess.bind(this),
        this.onLoadTopicsError.bind(this)
      );
  }

  onLoadTopicsSuccess(topics: Topics): void {
    const key = this.route.snapshot.paramMap.get('key');

    this.topicSearch = topics;

    this.topic = this.topicSearch.topics.find(t => t.key === key);
    if (!this.topic.selected) {
      this.topic.selected = true;
      // TODO сохранить результаты
    }

    this.prevTopic = this.topicSearch.prevTopic(key);
    this.nextTopic = this.topicSearch.nextTopic(key);

    this.loaded = !!this.topic;
    this.loading = false;
  }

  onLoadTopicsError(error: any): void {
  }
}
