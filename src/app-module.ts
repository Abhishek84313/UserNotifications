import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPreferencesController } from './controllers/preferences-controller';
import { NotificationController } from './controllers/notification-controller';
import { UserPreferencesService } from './services/preferences-service';
import { NotificationService } from './services/notification-service';
import { RateLimiterMiddleware } from './rate-limiter';
import { UserPreferenceSchema } from './schemas/user-preferences-schema';
import { NotificationLogSchema } from './schemas/notification-log-schema';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://127.0.0.1:27017"),
    MongooseModule.forFeature([
      { name: 'UserPreference', schema: UserPreferenceSchema },
      { name: 'NotificationLog', schema: NotificationLogSchema }
    ])
  ],
  controllers: [
    UserPreferencesController, 
    NotificationController
  ],
  providers: [
    UserPreferencesService, 
    NotificationService
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimiterMiddleware)
      .forRoutes('api/notifications', 'api/preferences');
  }
}
