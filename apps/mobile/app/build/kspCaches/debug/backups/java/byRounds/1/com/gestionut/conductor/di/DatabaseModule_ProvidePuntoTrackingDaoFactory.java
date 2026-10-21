package com.gestionut.conductor.di;

import com.gestionut.conductor.data.local.AppDatabase;
import com.gestionut.conductor.data.local.dao.PuntoTrackingDao;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.Preconditions;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

@ScopeMetadata("javax.inject.Singleton")
@QualifierMetadata
@DaggerGenerated
@Generated(
    value = "dagger.internal.codegen.ComponentProcessor",
    comments = "https://dagger.dev"
)
@SuppressWarnings({
    "unchecked",
    "rawtypes",
    "KotlinInternal",
    "KotlinInternalInJava",
    "cast"
})
public final class DatabaseModule_ProvidePuntoTrackingDaoFactory implements Factory<PuntoTrackingDao> {
  private final Provider<AppDatabase> databaseProvider;

  public DatabaseModule_ProvidePuntoTrackingDaoFactory(Provider<AppDatabase> databaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  @Override
  public PuntoTrackingDao get() {
    return providePuntoTrackingDao(databaseProvider.get());
  }

  public static DatabaseModule_ProvidePuntoTrackingDaoFactory create(
      Provider<AppDatabase> databaseProvider) {
    return new DatabaseModule_ProvidePuntoTrackingDaoFactory(databaseProvider);
  }

  public static PuntoTrackingDao providePuntoTrackingDao(AppDatabase database) {
    return Preconditions.checkNotNullFromProvides(DatabaseModule.INSTANCE.providePuntoTrackingDao(database));
  }
}
